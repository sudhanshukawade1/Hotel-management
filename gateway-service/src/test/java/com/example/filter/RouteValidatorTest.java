package com.example.filter;

import org.junit.jupiter.api.Test;
import org.springframework.http.server.reactive.ServerHttpRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RouteValidatorTest {

    @Test
    void shouldIdentifySecuredEndpoints() {
        // Arrange
        RouteValidator validator = new RouteValidator();
        ServerHttpRequest request = mock(ServerHttpRequest.class);
        
        // Mock secured path
        when(request.getURI()).thenReturn(java.net.URI.create("http://localhost:8080/api/secured"));
        
        // Act & Assert
        assertTrue(validator.isSecured.test(request));
    }

    @Test
    void shouldIdentifyPublicEndpoints() {
        // Arrange
        RouteValidator validator = new RouteValidator();
        ServerHttpRequest request = mock(ServerHttpRequest.class);
        
        // Test each public endpoint
        for (String endpoint : RouteValidator.openApiEndpoints) {
            // Mock public path
            when(request.getURI()).thenReturn(java.net.URI.create("http://localhost:8080" + endpoint));
            
            // Act & Assert
            assertFalse(validator.isSecured.test(request), 
                    "Endpoint " + endpoint + " should be identified as public");
        }
    }
} 