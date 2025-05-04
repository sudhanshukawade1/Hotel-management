package com.example.filter;

import com.example.util.JwtUtil; 
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private GatewayFilterChain filterChain;

    private RouteValidator routeValidator;
    
    private AuthenticationFilter authenticationFilter;

    private GatewayFilter filter;

    @BeforeEach
    void setUp() {
        // Create a real RouteValidator to avoid mocking issues with Predicate field
        routeValidator = new RouteValidator();
        
        // Manually initialize AuthenticationFilter and inject mocks
        authenticationFilter = new AuthenticationFilter();
        ReflectionTestUtils.setField(authenticationFilter, "validator", routeValidator);
        ReflectionTestUtils.setField(authenticationFilter, "jwtUtil", jwtUtil);
        
        filter = authenticationFilter.apply(new AuthenticationFilter.Config());
    }

    @Test
    void shouldContinueChainForUnsecuredEndpoint() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/auth/login")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        when(filterChain.filter(exchange)).thenReturn(Mono.empty());

        // Act
        filter.filter(exchange, filterChain);

        // Assert
        verify(filterChain).filter(exchange);
        verify(jwtUtil, never()).validateToken(anyString());
    }

    @Test
    void shouldThrowExceptionWhenAuthorizationHeaderIsMissing() {
        // Arrange
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/inventory/items/add")
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            filter.filter(exchange, filterChain);
        });

        // Assert
        assertEquals("Missing authorization header", exception.getMessage());
        verify(filterChain, never()).filter(any());
    }

    @Test
    void shouldExtractBearerTokenAndValidate() {
        // Arrange
        String token = "valid.jwt.token";
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/inventory/items/add")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        when(jwtUtil.getRoleFromToken(token)).thenReturn("MANAGER");
        when(jwtUtil.getEmailFromToken(token)).thenReturn("manager@example.com");
        when(filterChain.filter(any())).thenReturn(Mono.empty());

        // Act
        filter.filter(exchange, filterChain);

        // Assert
        verify(jwtUtil).validateToken(token);
        verify(jwtUtil).getRoleFromToken(token);
        verify(jwtUtil).getEmailFromToken(token);
        verify(filterChain).filter(any());
        
        // Verify request headers were mutated with role and email
        ServerHttpRequest mutatedRequest = exchange.getRequest();
        assertEquals("MANAGER", mutatedRequest.getHeaders().getFirst("X-User-Role"));
        assertEquals("manager@example.com", mutatedRequest.getHeaders().getFirst("X-User-Email"));
    }

    @Test
    void shouldThrowExceptionWhenTokenValidationFails() {
        // Arrange
        String token = "invalid.jwt.token";
        MockServerHttpRequest request = MockServerHttpRequest
                .get("/inventory/items/add")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
        ServerWebExchange exchange = MockServerWebExchange.from(request);
        
        doThrow(new RuntimeException("Token validation failed")).when(jwtUtil).validateToken(token);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            filter.filter(exchange, filterChain);
        });
        
        // Assert
        assertEquals("Unauthorized access to application", exception.getMessage());
        verify(filterChain, never()).filter(any());
    }
    
    // Utility class for setting private fields in tests
    private static class ReflectionTestUtils {
        public static void setField(Object target, String fieldName, Object value) {
            try {
                java.lang.reflect.Field field = target.getClass().getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(target, value);
            } catch (Exception e) {
                throw new RuntimeException("Failed to set field: " + fieldName, e);
            }
        }
    }
} 