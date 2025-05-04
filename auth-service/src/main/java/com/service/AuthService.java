package com.service;

import com.dto.LoginRequest;
import com.dto.RegisterRequest;
import com.model.User;
import com.model.Role;
import com.repository.UserRepository;
import com.util.JwtUtil;
import com.exception.AppExceptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


/**
 * Service class responsible for handling authentication and user management operations.
 * This service provides functionality for user registration, login, and user management.
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Constructor for AuthService with dependency injection.
     * 
     * @param userRepository Repository for user data access
     * @param passwordEncoder Encoder for password hashing
     * @param authenticationManager Manager for authentication operations
     * @param jwtUtil Utility for JWT token operations
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        logger.info("AuthService initialized with dependencies");
    }

    /**
     * Registers a new user in the system.
     * 
     * @param request Contains user registration details (email, password, role)
     * @return Success message upon successful registration
     * @throws RuntimeException if registration fails
     */
    public String register(RegisterRequest request) {
        logger.info("Starting user registration for email: {}", request.getEmail());
        if (request.getEmail() == null || request.getEmail().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty() ||
            request.getRole() == null) {
            throw new AppExceptions.ValidationException("Email, password, and role are required");
        }
        boolean validRole = false;
        for (Role r : Role.values()) {
            if (r == request.getRole()) {
                validRole = true;
                break;
            }
        }
        if (!validRole) {
            throw new AppExceptions.ValidationException("Invalid role: " + request.getRole());
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppExceptions.DuplicateEmailException("Email already in use");
        }
        try {
            // Create new user with encoded password
            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
                    .build();
            userRepository.save(user);
            logger.info("User registration completed successfully for email: {}", request.getEmail());
            return "User registered successfully";
        } catch (Exception e) {
            logger.error("Error during user registration for email {}: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     * 
     * @param request Contains user login credentials (email and password)
     * @return JWT token for authenticated user
     * @throws BadCredentialsException if authentication fails
     * @throws RuntimeException if user not found or token generation fails
     */
    public String login(LoginRequest request) {
        logger.info("Starting login process for user: {}", request.getEmail());
        if (request.getEmail() == null || request.getEmail().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new AppExceptions.ValidationException("Email and password are required");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            logger.debug("Authentication successful for user: {}", request.getEmail());
        } catch (BadCredentialsException e) {
            logger.warn("Authentication failed for user: {} - Invalid credentials", request.getEmail());
            throw new AppExceptions.InvalidCredentialsException("Invalid credentials");
        }
        try {
            UserDetails userDetails = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        logger.error("User not found after successful authentication: {}", request.getEmail());
                        return new AppExceptions.UserNotFoundException("User not found");
                    });
            String token = jwtUtil.generateToken(userDetails);
            logger.info("JWT token generated successfully for user: {}", request.getEmail());
            return token;
        } catch (Exception e) {
            logger.error("Error during token generation for user {}: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }
    
    /**
     * Updates an existing user's information.
     * 
     * @param id ID of the user to update
     * @param request Contains updated user information
     * @return Updated user object
     * @throws RuntimeException if user not found or update fails
     */
    public User updateUser(Long id, RegisterRequest request) {
        logger.info("Starting user update for ID: {}", id);
        try {
            User user = userRepository.findById(id).orElseThrow(() -> {
                logger.error("User not found for update, ID: {}", id);
                return new AppExceptions.UserNotFoundException("User not found");
            });
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                logger.debug("Updating password for user: {}", user.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            user.setRole(request.getRole());
            User updatedUser = userRepository.save(user);
            logger.info("User updated successfully: {}", updatedUser.getEmail());
            return updatedUser;
        } catch (Exception e) {
            logger.error("Error updating user with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }
    
    /**
     * Retrieves a user by their ID.
     * 
     * @param id ID of the user to retrieve
     * @return User object
     * @throws RuntimeException if user not found
     */
    public User getUserById(Long id) {
        logger.info("Fetching user by ID: {}", id);
        try {
            User user = userRepository.findById(id).orElseThrow(() -> {
                logger.error("User not found, ID: {}", id);
                return new AppExceptions.UserNotFoundException("User not found");
            });
            logger.info("User retrieved successfully: {}", user.getEmail());
            return user;
        } catch (Exception e) {
            logger.error("Error fetching user with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }
    
    /**
     * Deletes a user by their ID.
     * 
     * @param id ID of the user to delete
     * @throws RuntimeException if user not found or deletion fails
     */
    public void deleteUserById(Long id) {
        logger.info("Attempting to delete user with ID: {}", id);
        try {
            if (!userRepository.existsById(id)) {
                logger.error("User not found for deletion, ID: {}", id);
                throw new AppExceptions.UserNotFoundException("User not found");
            }
            userRepository.deleteById(id);
            logger.info("User deleted successfully, ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting user with ID {}: {}", id, e.getMessage());
            throw e;
        }
    }
    
    /**
     * Deletes all users from the system.
     * This operation should be used with caution as it removes all user data.
     * 
     * @throws RuntimeException if deletion fails
     */
    public void deleteAllUsers() {
        logger.warn("Starting deletion of all users");
        try {
            userRepository.deleteAll();
            logger.warn("All users deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting all users: {}", e.getMessage());
            throw e;
        }
    }
}