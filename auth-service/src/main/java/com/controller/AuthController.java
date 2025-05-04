package com.controller;

import com.dto.LoginRequest; 

import com.dto.RegisterRequest;
import com.dto.UserResponse;
import com.model.User;
import com.repository.UserRepository;
import com.service.AuthService;
import com.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import org.apache.hc.core5.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.exception.AppExceptions;


 // REST controller for handling authentication and user management endpoints
 
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserRepository userRepository;
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    
    public AuthController(UserRepository userRepository, AuthService authService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        logger.info("Registering new user with email: {}", request.getEmail());
        String response = authService.register(request);
        logger.info("User registered successfully: {}", request.getEmail());
        return ResponseEntity.ok(response);
    }
   
    // Get all users
    @GetMapping("/users")
    public List<UserResponse> getAllUsers(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        logger.info("Fetching all users");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppExceptions.UnauthorizedException("Unauthorized");
        }
        List<UserResponse> users = userRepository.findAll()
            .stream()
            .map(n -> new UserResponse(
                n.getId(),
                n.getEmail(),
                n.getRole()
            ))
            .toList();
        logger.info("Retrieved {} users", users.size());
        return users;
    }

    // Authenticate user and return JWT token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("Login attempt for user: {}", request.getEmail());
        String token = authService.login(request);
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new AppExceptions.UserNotFoundException("User not found"));
        UserResponse userResponse = new UserResponse(user.getId(), user.getEmail(), user.getRole());
        logger.info("Login successful for user: {}", request.getEmail());
        return ResponseEntity.ok(Map.of("token", token, "user", userResponse));
    }
    
    // Validate JWT token
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        logger.debug("Validating token from Authorization header");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Invalid Authorization header format");
            return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST)
                .body(Map.of("error", "Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7);
        try {
            String username = jwtUtil.extractUsername(token);
            if (jwtUtil.isTokenExpired(token)) {
                logger.warn("Expired token for user: {}", username);
                return ResponseEntity.status(HttpStatus.SC_UNAUTHORIZED)
                    .body(Map.of("error", "Token has expired"));
            }
            User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            logger.info("Token validated successfully for user: {}", username);
            Map<String, Object> response = Map.of(
                "valid", true,
                "email", username,
                "roles", user.getAuthorities().stream().map(Object::toString).toList()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SC_UNAUTHORIZED)
                .body(Map.of("error", "Invalid token", "message", e.getMessage()));
        }
    }
        
    // Update user details
    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody RegisterRequest request,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader) {
        logger.info("Updating user with ID: {}", id);
        if (roleHeader == null || !"OWNER".equals(roleHeader)) {
            logger.warn("Unauthorized attempt to update user by role: {}", roleHeader);
            throw new AppExceptions.ForbiddenException("Only OWNER can update users");
        }
        User user = authService.updateUser(id, request);
        logger.info("User updated successfully: {}", user.getEmail());
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getRole()));
    }
        
    // Get user by ID
    @GetMapping("/usersbyid/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        logger.info("Fetching user by ID: {}", id);
        User user = authService.getUserById(id);
        logger.info("User retrieved successfully: {}", user.getEmail());
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getRole()));
    }
         
    // Delete user by ID
    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUserById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader) {
        logger.info("Deleting user with ID: {}", id);
        if (roleHeader == null || !"OWNER".equals(roleHeader)) {
            logger.warn("Unauthorized attempt to delete user by role: {}", roleHeader);
            throw new AppExceptions.ForbiddenException("Only OWNER can delete users");
        }
        authService.deleteUserById(id);
        logger.info("User deleted successfully: {}", id);
        return ResponseEntity.ok("User deleted successfully");
    }
        
    // Delete all users
    @DeleteMapping("/users")
    public ResponseEntity<String> deleteAllUsers() {
        logger.warn("Attempting to delete all users");
        authService.deleteAllUsers();
        logger.warn("All users deleted successfully");
        return ResponseEntity.ok("All users deleted successfully");
    }
}