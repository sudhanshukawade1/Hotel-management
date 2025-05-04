package com.example.exception;

public class AppExceptions {
    public static class PaymentAlreadyProcessedException extends RuntimeException {
        public PaymentAlreadyProcessedException(String message) { super(message); }
    }
    public static class ReservationNotFoundException extends RuntimeException {
        public ReservationNotFoundException(String message) { super(message); }
    }
    public static class PaymentVerificationException extends RuntimeException {
        public PaymentVerificationException(String message) { super(message); }
    }
} 