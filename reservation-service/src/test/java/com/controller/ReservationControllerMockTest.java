package com.controller;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.dto.ReservationRequest;
import com.dto.RoomRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.model.Reservation;
import com.model.Room;
import com.service.ReservationService;

@ExtendWith(MockitoExtension.class)
public class ReservationControllerMockTest {

    private static final Logger logger = LoggerFactory.getLogger(ReservationControllerMockTest.class);

    private MockMvc mockMvc;
    
    @Mock
    private ReservationService reservationService;
    
    @InjectMocks
    private ReservationController reservationController;
    
    private ObjectMapper objectMapper;
    
    private Room testRoom;
    private Reservation testReservation;
    private ReservationRequest testReservationRequest;
    private RoomRequest testRoomRequest;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(reservationController).build();
        
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // For handling LocalDate serialization
        
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
        
        // Set up test room request
        testRoomRequest = new RoomRequest();
        testRoomRequest.setId(1L);
        testRoomRequest.setRoomNumber("101");
        testRoomRequest.setType("Deluxe");
        testRoomRequest.setPrice(100.0);
        testRoomRequest.setAvailable(true);
        
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
    }
    
    @Test
    void testGetAvailableRooms() throws Exception {
        // Arrange
        List<Room> availableRooms = Arrays.asList(testRoom);
        when(reservationService.findAvailableRooms(any(LocalDate.class), any(LocalDate.class)))
            .thenReturn(availableRooms);
        
        // Act & Assert
        mockMvc.perform(get("/public/rooms/available")
                .param("checkIn", checkInDate.toString())
                .param("checkOut", checkOutDate.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].roomNumber").value("101"))
                .andExpect(jsonPath("$[0].type").value("Deluxe"));
        
        logger.info("Available rooms endpoint test passed");
    }
    
    @Test
    void testBookRoom_Success() throws Exception {
        // Arrange
        when(reservationService.createBooking(any(ReservationRequest.class), anyString()))
            .thenReturn(testReservation);
        when(reservationService.calculateTotalPrice(any(Reservation.class)))
            .thenReturn(200.0);
        
        // Act & Assert
        mockMvc.perform(post("/reservation/book")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testReservationRequest))
                .header("X-User-Email", "receptionist@example.com")
                .header("X-User-Role", "RECEPTIONIST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("BOOKED"))
                .andExpect(jsonPath("$.reservationId").value(1))
                .andExpect(jsonPath("$.guestName").value("John Doe"))
                .andExpect(jsonPath("$.Price").value(200.0));
        
        logger.info("Book room endpoint test passed");
    }
    
   
    
    
    @Test
    void testAddRoom_Success() throws Exception {
        // Arrange
        when(reservationService.saveRoom(any(Room.class))).thenReturn(testRoom);
        
        // Act & Assert
        mockMvc.perform(post("/rooms/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRoomRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomNumber").value("101"))
                .andExpect(jsonPath("$.type").value("Deluxe"));
        
        logger.info("Add room endpoint test passed");
    }
    
    @Test
    void testGetRoomById() throws Exception {
        // Arrange
        when(reservationService.getRoomById(anyLong())).thenReturn(testRoomRequest);
        
        // Act & Assert
        mockMvc.perform(get("/rooms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomNumber").value("101"))
                .andExpect(jsonPath("$.type").value("Deluxe"))
                .andExpect(jsonPath("$.price").value(100.0));
        
        logger.info("Get room by ID endpoint test passed");
    }
    
    
    @Test
    void testGetReservationDetails_Success() throws Exception {
        // Arrange
        when(reservationService.findById(anyLong())).thenReturn(testReservation);
        when(reservationService.calculateTotalPrice(any(Reservation.class))).thenReturn(200.0);
        
        // Act & Assert
        mockMvc.perform(get("/reservation/details/1")
                .header("X-User-Role", "MANAGER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guestName").value("John Doe"))
                .andExpect(jsonPath("$.roomNumber").value("101"))
                .andExpect(jsonPath("$.Price").value(200.0));
        
        logger.info("Get reservation details endpoint test passed");
    }
    
    @Test
    void testGetReservationDetails_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/reservation/details/1")
                .header("X-User-Role", "GUEST"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Requires OWNER, MANAGER, or RECEPTIONIST role"));
        
        logger.info("Get reservation details unauthorized test passed");
    }
    
    @Test
    void testGetAllReservations() throws Exception {
        // Arrange
        List<ReservationRequest> reservations = Arrays.asList(testReservationRequest);
        when(reservationService.getAllReservations()).thenReturn(reservations);
        
        // Act & Assert
        mockMvc.perform(get("/reservation/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].guestName").value("John Doe"))
                .andExpect(jsonPath("$[0].guestEmail").value("john@example.com"));
        
        logger.info("Get all reservations endpoint test passed");
    }
} 