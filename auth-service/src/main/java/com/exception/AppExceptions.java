package com.exception;

public class AppExceptions {
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) { super(message); }
    }
    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) { super(message); }
    }
    public static class DuplicateEmailException extends RuntimeException {
        public DuplicateEmailException(String message) { super(message); }
    }
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) { super(message); }
    }
    public static class ForbiddenException extends RuntimeException {
        public ForbiddenException(String message) { super(message); }
    }
    public static class ValidationException extends RuntimeException {
        public ValidationException(String message) { super(message); }
    }
} 