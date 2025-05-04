package com.example.exception;

public class AppExceptions {
    public static class ItemNotFoundException extends RuntimeException {
        public ItemNotFoundException(String message) { super(message); }
    }
    public static class StaffNotFoundException extends RuntimeException {
        public StaffNotFoundException(String message) { super(message); }
    }
    public static class DuplicateItemException extends RuntimeException {
        public DuplicateItemException(String message) { super(message); }
    }
} 