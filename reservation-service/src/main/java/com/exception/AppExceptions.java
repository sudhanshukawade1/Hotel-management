package com.exception;

public class AppExceptions {
    public static class RoomNotFoundException extends RuntimeException {
        public RoomNotFoundException(String message) { super(message); }
    }
    public static class RoomAlreadyBookedException extends RuntimeException {
        public RoomAlreadyBookedException(String message) { super(message); }
    }
    public static class DuplicateRoomException extends RuntimeException {
        public DuplicateRoomException(String message) { super(message); }
    }
    public static class ReservationNotFoundException extends RuntimeException {
        public ReservationNotFoundException(String message) { super(message); }
    }
    public static class ActiveReservationsException extends RuntimeException {
        public ActiveReservationsException(String message) { super(message); }
    }
} 