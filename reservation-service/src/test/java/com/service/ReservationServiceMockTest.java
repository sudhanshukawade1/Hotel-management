package com.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dto.ReservationRequest;
import com.dto.RoomRequest;
import com.model.Reservation;
import com.model.Room;
import com.repository.ReservationRepository;
import com.repository.RoomRepository;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceMockTest {

    private static final Logger logger = LoggerFactory.getLogger(ReservationServiceMockTest.class);

    @Mock
    private ReservationRepository reservationRepository;
    
    @Mock
    private RoomRepository roomRepository;
    
    @InjectMocks
    private ReservationService reservationService;
    
    private Room testRoom;
    private Reservation testReservation;
    private ReservationRequest testReservationRequest;
    private RoomRequest testRoomRequest;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    @BeforeEach
    void setUp() {
        // Set up dates
        checkInDate = LocalDate.now().plusDays(1);
        checkOutDate = LocalDate.now().plusDays(3);
        
        // Set up test room
        testRoom = new Room();
        testRoom.setId(1L);
        testRoom.setRoomNumber("101");
        testRoom.setType("Deluxe");
        testRoom.setPricePerNight(100.0);
        testRoom.setIsAvailable(true);
        
        // Set up test reservation
        testReservation = new Reservation();
        testReservation.setId(1L);
        testReservation.setGuestName("John Doe");
        testReservation.setGuestEmail("john@example.com");
        testReservation.setRoom(testRoom);
        testReservation.setCheckInDate(checkInDate);
        testReservation.setCheckOutDate(checkOutDate);
        testReservation.setStatus("CONFIRMED");
        
        // Set up test reservation request
        testReservationRequest = new ReservationRequest();
        testReservationRequest.setId(1L);
        testReservationRequest.setGuestName("John Doe");
        testReservationRequest.setGuestEmail("john@example.com");
        testReservationRequest.setRoomId(1L);
        testReservationRequest.setCheckInDate(checkInDate);
        testReservationRequest.setCheckOutDate(checkOutDate);
        
        // Set up test room request
        testRoomRequest = new RoomRequest();
        testRoomRequest.setId(1L);
        testRoomRequest.setRoomNumber("101");
        testRoomRequest.setType("Deluxe");
        testRoomRequest.setPrice(100.0);
        testRoomRequest.setAvailable(true);
    }
    
    @Test
    void testFindAvailableRooms_Success() {
        // Arrange
        List<Reservation> overlappingReservations = new ArrayList<>();
        List<Room> allRooms = Arrays.asList(testRoom);
        
        when(reservationRepository.findOverlappingReservations(any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(overlappingReservations);
        when(roomRepository.findAll()).thenReturn(allRooms);
        
        // Act
        List<Room> availableRooms = reservationService.findAvailableRooms(checkInDate, checkOutDate);
        
        // Assert
        logger.info("Available rooms found: {}", availableRooms.size());
        assertEquals(1, availableRooms.size());
        assertEquals("101", availableRooms.get(0).getRoomNumber());
        verify(reservationRepository).findOverlappingReservations(checkInDate, checkOutDate);
        verify(roomRepository).findAll();
    }
    
    @Test
    void testCreateBooking_Success() {
        // Arrange
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findOverlappingReservations(any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(new ArrayList<>());
        when(roomRepository.save(any(Room.class))).thenReturn(testRoom);
        when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);
        
        // Act
        Reservation result = reservationService.createBooking(testReservationRequest, "receptionist@example.com");
        
        // Assert
        logger.info("Reservation created with ID: {}", result.getId());
        assertNotNull(result);
        assertEquals("John Doe", result.getGuestName());
        assertEquals("101", result.getRoom().getRoomNumber());
        assertEquals("CONFIRMED", result.getStatus());
        verify(roomRepository).findById(1L);
        verify(reservationRepository).findOverlappingReservations(checkInDate, checkOutDate);
        verify(roomRepository).save(any(Room.class));
        verify(reservationRepository).save(any(Reservation.class));
    }
    
    @Test
    void testCreateBooking_RoomNotFound() {
        // Arrange
        when(roomRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            reservationService.createBooking(testReservationRequest, "receptionist@example.com");
        });
        
        logger.error("Expected error: {}", exception.getMessage());
        assertEquals("Room not found", exception.getMessage());
        verify(roomRepository).findById(1L);
        verifyNoMoreInteractions(reservationRepository);
    }
    
    @Test
    void testCreateBooking_RoomAlreadyBooked() {
        // Arrange
        List<Reservation> overlappingReservations = Arrays.asList(testReservation);
        
        when(roomRepository.findById(anyLong())).thenReturn(Optional.of(testRoom));
        when(reservationRepository.findOverlappingReservations(any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(overlappingReservations);
        
        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            reservationService.createBooking(testReservationRequest, "receptionist@example.com");
        });
        
        logger.error("Expected error: {}", exception.getMessage());
        assertEquals("Room is already booked for these dates", exception.getMessage());
        verify(roomRepository).findById(1L);
        verify(reservationRepository).findOverlappingReservations(checkInDate, checkOutDate);
    }
    
    @Test
    void testCalculateTotalPrice() {
        // Act
        double totalPrice = reservationService.calculateTotalPrice(testReservation);
        
        // Assert
        logger.info("Calculated total price: {}", totalPrice);
        assertEquals(200.0, totalPrice); // 2 nights at $100 per night
    }
    
    @Test
    void testSaveRoom_Success() {
        // Arrange
        when(roomRepository.existsByRoomNumber(anyString())).thenReturn(false);
        when(roomRepository.save(any(Room.class))).thenReturn(testRoom);
        
        // Act
        Room result = reservationService.saveRoom(testRoom);
        
        // Assert
        logger.info("Room saved with ID: {}", result.getId());
        assertNotNull(result);
        assertEquals("101", result.getRoomNumber());
        verify(roomRepository).existsByRoomNumber("101");
        verify(roomRepository).save(testRoom);
    }
    
 
  
    
    @Test
    void testGetRoomById_NotFound() {
        // Arrange
        when(roomRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            reservationService.getRoomById(1L);
        });
        
        logger.error("Expected error: {}", exception.getMessage());
        assertEquals("Room not found", exception.getMessage());
        verify(roomRepository).findById(1L);
    }
} 