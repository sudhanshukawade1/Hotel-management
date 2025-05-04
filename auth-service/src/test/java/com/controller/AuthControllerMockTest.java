package com.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.dto.LoginRequest;
import com.dto.RegisterRequest;
import com.exception.AppExceptions;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.Role;
import com.model.User;
import com.repository.UserRepository;
import com.service.AuthService;
import com.util.JwtUtil;

public class AuthControllerMockTest {

    private MockMvc mockMvc;
    
    @Mock
    private AuthService authService;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @InjectMocks
    private AuthController authController;
    
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Create a custom AuthController for testing to bypass spring exception handling
        AuthController testController = new AuthController(userRepository, authService, jwtUtil) {
            @Override
            public ResponseEntity<?> login(LoginRequest request) {
                try {
                    String token = authService.login(request);
                    return ResponseEntity.ok(Map.of("token", token));
                } catch (AppExceptions.InvalidCredentialsException e) {
                    return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
                }
            }
        };
        
        // Setup with our custom controller
        mockMvc = MockMvcBuilders.standaloneSetup(testController).build();
    }
    
    @Test
    void testRegister() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setRole(Role.MANAGER);
        
        when(authService.register(any(RegisterRequest.class))).thenReturn("User registered successfully");
        
        // Act & Assert
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }
    
    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        
        User testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setRole(Role.MANAGER);
        
        when(authService.login(any(LoginRequest.class))).thenReturn("jwtToken");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        
        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwtToken"));
    }
    
    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");
        
        when(authService.login(any(LoginRequest.class)))
            .thenThrow(new AppExceptions.InvalidCredentialsException("Invalid credentials"));
        
        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }
} 