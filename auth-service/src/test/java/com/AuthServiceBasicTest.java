package com;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dto.LoginRequest;
import com.dto.RegisterRequest;
import com.exception.AppExceptions;
import com.model.Role;
import com.model.User;
import com.repository.UserRepository;
import com.service.AuthService;
import com.util.JwtUtil;

public class AuthServiceBasicTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @InjectMocks
    private AuthService authService;
    
    private User testUser;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(Role.MANAGER);
        
        // Setup common mocks
        when(passwordEncoder.encode(any(String.class))).thenReturn("encodedPassword");
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("test-jwt-token");
    }
    
    @Test
    public void testRegister() {
        // Mock repository behavior for registration
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        // Register a new user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole(Role.MANAGER);
        
        String registerResult = authService.register(registerRequest);
        assertEquals("User registered successfully", registerResult);
    }
    
    @Test
    public void testLogin() {
        // Setup for login
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
        
        String token = authService.login(loginRequest);
        assertNotNull(token);
        assertEquals("test-jwt-token", token);
    }
    
    @Test
    public void testLoginWithInvalidCredentials() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrong@example.com");
        loginRequest.setPassword("wrongPassword");
        
        // Mock authentication failure
        when(authenticationManager.authenticate(any()))
            .thenThrow(new BadCredentialsException("Invalid email or password"));
        
        // Act & Assert
        assertThrows(AppExceptions.InvalidCredentialsException.class, () -> {
            authService.login(loginRequest);
        });
    }
} 