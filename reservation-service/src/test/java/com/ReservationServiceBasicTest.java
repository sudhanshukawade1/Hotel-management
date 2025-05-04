package com;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dto.ReservationRequest;
import com.model.Reservation;
import com.model.Room;
import com.repository.ReservationRepository;
import com.repository.RoomRepository;
import com.service.ReservationService;

public class ReservationServiceBasicTest {

    private static final Logger logger = LoggerFactory.getLogger(ReservationServiceBasicTest.class);

    @Mock
    private ReservationRepository reservationRepository;
    
    @Mock
    private RoomRepository roomRepository;
    
    private ReservationService reservationService;
    
    private Room testRoom;
    private Reservation testReservation;
    private ReservationRequest testReservationRequest;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        reservationService = new ReservationService(reservationRepository, roomRepository);
        
        // Setup test room
        testRoom = new Room();
        testRoom.setId(1L);
        testRoom.setRoomNumber("101");
        testRoom.setType("Deluxe");
        testRoom.setPricePerNight(100.0);
        testRoom.setIsAvailable(true);
        
        // Setup test reservation
        LocalDate checkInDate = LocalDate.now().plusDays(1);
        LocalDate checkOutDate = LocalDate.now().plusDays(3);
        
        testReservation = new Reservation();
        testReservation.setId(1L);
        testReservation.setGuestName("John Doe");
        testReservation.setGuestEmail("john@example.com");
        testReservation.setRoom(testRoom);
        testReservation.setCheckInDate(checkInDate);
        testReservation.setCheckOutDate(checkOutDate);
        testReservation.setStatus("CONFIRMED");
        
        // Setup reservation request
        testReservationRequest = new ReservationRequest();
        testReservationRequest.setId(1L);
        testReservationRequest.setGuestName("John Doe");
        testReservationRequest.setGuestEmail("john@example.com");
        testReservationRequest.setRoomId(1L);
        testReservationRequest.setCheckInDate(checkInDate);
        testReservationRequest.setCheckOutDate(checkOutDate);
    }
    
    @Test
    public void testReservationBookingFlow() {
        // Mock repository behavior
        when(roomRepository.findById(1L)).thenReturn(Optional.of(testRoom));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);
        when(roomRepository.save(any(Room.class))).thenReturn(testRoom);
        
        // Create a booking
        Reservation reservation = reservationService.createBooking(testReservationRequest, "receptionist@example.com");
        
        // Verify the result
        assertNotNull(reservation);
        assertEquals("John Doe", reservation.getGuestName());
        assertEquals("john@example.com", reservation.getGuestEmail());
        assertEquals("CONFIRMED", reservation.getStatus());
        logger.info("Reservation booking successful with ID: {}", reservation.getId());
        
        // Calculate total price
        double totalPrice = reservationService.calculateTotalPrice(reservation);
        assertEquals(200.0, totalPrice); // 2 nights at $100 per night
        logger.info("Total price calculated correctly: ${}", totalPrice);
    }
    
    @Test
    public void testCalculateTotalPrice() {
        // Calculate total price for a 2-night stay
        double totalPrice = reservationService.calculateTotalPrice(testReservation);
        
        // Verify the result
        assertEquals(200.0, totalPrice);
        logger.info("Price calculation test passed: ${}", totalPrice);
    }
} 