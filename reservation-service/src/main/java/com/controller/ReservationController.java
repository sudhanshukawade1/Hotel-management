package com.controller;

import com.dto.ReservationRequest; 
import com.dto.RoomRequest;
import com.model.Reservation;
import com.model.Room;
import com.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
public class ReservationController {
    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    // dependency injection using constructor injection 
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // Get all available rooms for a given date range 
    @GetMapping("/public/rooms/available")
    public List<Room> getAvailableRooms(
        @RequestParam LocalDate checkIn,
        @RequestParam LocalDate checkOut) {
        logger.debug("Fetching available rooms for check-in: {} and check-out: {}", checkIn, checkOut);
        return reservationService.findAvailableRooms(checkIn, checkOut);
    }
    
    // Book a room for a guest
    @PostMapping("/reservation/book")
    public ResponseEntity<Map<String, Object>> bookRoom(
            @Valid @RequestBody ReservationRequest request,
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        logger.info("Attempting to book room with request: {}", request);
        
        if (email == null || role == null) {
            logger.warn("Missing user email or role in booking request");
            return new ResponseEntity<>(Map.of("message", "Missing user email or role"), HttpStatus.BAD_REQUEST);
        }

        List<String> allowedRoles = List.of("OWNER", "MANAGER", "RECEPTIONIST");
        if (!allowedRoles.contains(role)) {
            logger.warn("Unauthorized booking attempt by role: {}", role);
            return new ResponseEntity<>(Map.of("message", "Requires OWNER, MANAGER, or RECEPTIONIST role"), HttpStatus.FORBIDDEN);
        }
            // create a new reservation object to store in the database
            Reservation reservation = reservationService.createBooking(request, email);
            logger.info("Room successfully booked by {} (role: {})", email, role);
            return ResponseEntity.ok(Map.of(
                "status", "BOOKED",
                "reservationId", reservation.getId(),
                "guestName", reservation.getGuestName(),
                "roomNumber", reservation.getRoom().getRoomNumber(),
                "checkInDate", reservation.getCheckInDate(),
                "checkOutDate", reservation.getCheckOutDate(),
                "Price", reservationService.calculateTotalPrice(reservation),
                "message", "Room booked by " + role + " " + email
            ));
    }

    // Add a new room to the database
    @PostMapping("/rooms/add")
    public ResponseEntity<?> addRoom(@Valid @RequestBody RoomRequest request) {
        logger.info("Attempting to add new room: {}", request);
            Room room = new Room();
            room.setRoomNumber(request.getRoomNumber());
            room.setType(request.getType());
            room.setPricePerNight(request.getPrice());
            room.setIsAvailable(true);
            Room savedRoom = reservationService.saveRoom(room);
            logger.info("Room successfully added with ID: {}", savedRoom.getId());
            return ResponseEntity.ok(savedRoom);
    }
    
    // Get room details by ID
    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomRequest> getRoomById(@PathVariable Long id) {
        logger.debug("Fetching room details for ID: {}", id);
        return ResponseEntity.ok(reservationService.getRoomById(id));
    }
    // Update room details 
    @PutMapping("/rooms/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody RoomRequest request) {
        logger.info("Attempting to update room with ID: {}", id);
            RoomRequest updatedRoom = reservationService.updateRoom(id, request);
            logger.info("Room successfully updated with ID: {}", id);
            return ResponseEntity.ok(updatedRoom);
    }
    
    // Delete room by ID
    @DeleteMapping("/rooms/{id}") 
    public ResponseEntity<String> deleteRoomById(@PathVariable Long id) {
        logger.info("Attempting to delete room with ID: {}", id);
            reservationService.deleteRoomById(id);
            logger.info("Room successfully deleted with ID: {}", id);
            return ResponseEntity.ok("Room deleted successfully");
    }
    
    // Update reservation details
    @PutMapping("/reservation/{id}")
    public ResponseEntity<ReservationRequest> updateReservation(@PathVariable Long id, @RequestBody ReservationRequest request) {
        logger.info("Attempting to update reservation with ID: {}", id);
            ReservationRequest updatedReservation = reservationService.updateReservation(id, request);
            logger.info("Reservation successfully updated with ID: {}", id);
            return ResponseEntity.ok(updatedReservation);
    }

    // Delete reservation by ID
    @DeleteMapping("/reservation/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        logger.info("Attempting to delete reservation with ID: {}", id);
            reservationService.deleteReservation(id);
            logger.info("Reservation successfully deleted with ID: {}", id);
            return ResponseEntity.ok("Reservation deleted successfully");
    }
    
    // Get reservation details by ID
    @GetMapping("/reservation/details/{reservationId}")
    public ResponseEntity<Map<String, Object>> getReservationDetails(
            @PathVariable Long reservationId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        logger.info("Fetching reservation details for ID: {}", reservationId);
        
        List<String> allowedRoles = List.of("OWNER", "MANAGER", "RECEPTIONIST");
        if (role == null || !allowedRoles.contains(role)) {
            logger.warn("Unauthorized access attempt to reservation details by role: {}", role);
            return new ResponseEntity<>(Map.of("message", "Requires OWNER, MANAGER, or RECEPTIONIST role"), HttpStatus.FORBIDDEN);
        }

            Reservation reservation = reservationService.findById(reservationId);
            if (reservation == null) {
                logger.warn("Reservation not found with ID: {}", reservationId);
                return new ResponseEntity<>(Map.of("message", "Reservation not found"), HttpStatus.NOT_FOUND);
            }

            if (reservation.getRoom() == null) {
                logger.warn("No room assigned to reservation with ID: {}", reservationId);
                return new ResponseEntity<>(Map.of("message", "No room assigned to reservation"), HttpStatus.BAD_REQUEST);
            }

            double price = reservationService.calculateTotalPrice(reservation);
            logger.info("Successfully retrieved reservation details for ID: {}", reservationId);
            return ResponseEntity.ok(Map.of(
                "guestName", reservation.getGuestName(),
                "roomNumber", reservation.getRoom().getRoomNumber(),
                "Price", price
            ));
    }
    
    // Get all reservations
    @GetMapping("/reservation/all")
    public ResponseEntity<List<ReservationRequest>> getAllReservation() {
        logger.debug("Fetching all reservations");
        return ResponseEntity.ok(reservationService.getAllReservations());
    }
    
    // Get all rooms
    @GetMapping("/rooms/all")
    public List<Room> getAllRooms() {
        logger.info("Fetching all rooms");
        return reservationService.getAllRooms();
    }
}