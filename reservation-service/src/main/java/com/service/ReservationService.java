package com.service;

import com.dto.ReservationRequest;
import com.dto.RoomRequest;
import com.model.Reservation;
import com.model.Room;
import com.repository.ReservationRepository;
import com.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.exception.AppExceptions;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    // Initilize logger for logging messages
    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);
    
    // Dependency injection for reservation and room repositories
    private final ReservationRepository reservationRepo;
    private final RoomRepository roomRepo;
    
    public ReservationService(ReservationRepository reservationRepo, RoomRepository roomRepo) {
        this.reservationRepo = reservationRepo;
        this.roomRepo = roomRepo;
        logger.debug("ReservationService initialized");
    }
    
    // Find available rooms 
    public List<Room> findAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        logger.info("Finding available rooms between {} and {}", checkIn, checkOut);
        
        List<Reservation> overlapping = reservationRepo.findOverlappingReservations(checkIn, checkOut);
        logger.debug("Found {} overlapping reservations", overlapping.size());
        
        List<Long> bookedRoomIds = overlapping.stream()
            .map(res -> res.getRoom().getId())
            .toList();
        logger.debug("Booked room IDs: {}", bookedRoomIds);
        
        List<Room> availableRooms = roomRepo.findAll().stream()
            .filter(room -> !bookedRoomIds.contains(room.getId()))
            .toList();
        
        logger.info("Found {} available rooms", availableRooms.size());
        return availableRooms;
    }
    
    // Create a new reservation
    public Reservation createBooking(ReservationRequest request, String receptionistEmail) {
        logger.info("Creating booking for guest {} requested by {}", request.getGuestName(), receptionistEmail);
        logger.debug("Booking details: room ID={}, check-in={}, check-out={}", 
                 request.getRoomId(), request.getCheckInDate(), request.getCheckOutDate());
        
        Room room = roomRepo.findById(request.getRoomId())
                .orElseThrow(() -> {
                    logger.error("Room not found with ID: {}", request.getRoomId());
                    return new AppExceptions.RoomNotFoundException("Room not found");
                });
        
        logger.debug("Found room: {}, type={}", room.getRoomNumber(), room.getType());
        
        List<Reservation> overlapping = reservationRepo.findOverlappingReservations(
            request.getCheckInDate(), request.getCheckOutDate());
        
        if (overlapping.stream().anyMatch(r -> r.getRoom().getId().equals(room.getId()))) {
            logger.warn("Room {} is already booked for dates between {} and {}", 
                     room.getRoomNumber(), request.getCheckInDate(), request.getCheckOutDate());
            throw new AppExceptions.RoomAlreadyBookedException("Room is already booked for these dates");
        }
       
        // create a new reservation object to store in the database
       Reservation reservation = new Reservation();
       
       reservation.setGuestName(request.getGuestName());
       reservation.setGuestEmail(request.getGuestEmail());
       reservation.setRoom(room);
       reservation.setCheckInDate(request.getCheckInDate());
       reservation.setCheckOutDate(request.getCheckOutDate());
       reservation.setStatus("CONFIRMED");
        
        room.setIsAvailable(false);
        roomRepo.save(room);
        logger.debug("Room availability updated to false");
        
        Reservation savedReservation = reservationRepo.save(reservation);
        logger.info("Reservation created successfully with ID: {}", savedReservation.getId());
        
        return savedReservation;
    }
    
    // calculate the total price for a reservation
    public double calculateTotalPrice(Reservation reservation) {
        logger.debug("Calculating total price for reservation ID: {}", reservation.getId());
        
        long nights = ChronoUnit.DAYS.between(
            reservation.getCheckInDate(), 
            reservation.getCheckOutDate()
        );
        
        double price = nights * reservation.getRoom().getPricePerNight();
        logger.debug("Total price calculated: ${} ({} nights at ${} per night)", 
                  price, nights, reservation.getRoom().getPricePerNight());
        
        return price;
    }
    
    // save a new room to the database
    public Room saveRoom(Room room) {
        logger.info("Saving new room: {}, type={}", room.getRoomNumber(), room.getType());
        
        // Check if room number already exists
        if (roomRepo.existsByRoomNumber(room.getRoomNumber())) {
            logger.warn("Room number {} already exists", room.getRoomNumber());
            throw new AppExceptions.DuplicateRoomException("Room number " + room.getRoomNumber() + " already exists. Room numbers must be unique.");
        }
        
        Room savedRoom = roomRepo.save(room);
        logger.info("Room saved successfully with ID: {}", savedRoom.getId());
        
        return savedRoom;
    }
    // New methods with RoomRequest and ReservationRequest
    public RoomRequest getRoomById(Long id) {
        logger.info("Getting room by ID: {}", id);
        
        Room room = roomRepo.findById(id)
            .orElseThrow(() -> {
                logger.error("Room not found with ID: {}", id);
                return new AppExceptions.RoomNotFoundException("Room not found");
            });
        
        RoomRequest request = new RoomRequest();
        request.setId(room.getId());
        request.setRoomNumber(room.getRoomNumber());
        request.setType(room.getType());
        request.setPrice(room.getPricePerNight());
        request.setAvailable(room.getIsAvailable());
        
        logger.debug("Room found: {}, type={}, price=${}", 
                  room.getRoomNumber(), room.getType(), room.getPricePerNight());
        
        return request;
    }
    
    // update room details
    public RoomRequest updateRoom(Long id, RoomRequest request) {
        logger.info("Updating room with ID: {}", id);
        logger.debug("Update details: room number={}, type={}, price={}", 
                  request.getRoomNumber(), request.getType(), request.getPrice());
        
        Room room = roomRepo.findById(id)
            .orElseThrow(() -> {
                logger.error("Room not found with ID: {}", id);
                return new AppExceptions.RoomNotFoundException("Room not found");
            });
        
        // Check if new room number already exists (but ignore if it's the same room)
        if (!room.getRoomNumber().equals(request.getRoomNumber()) && 
            roomRepo.existsByRoomNumber(request.getRoomNumber())) {
            logger.warn("Cannot update room - room number {} already exists", request.getRoomNumber());
            throw new AppExceptions.DuplicateRoomException("Room number " + request.getRoomNumber() + " already exists. Room numbers must be unique.");
        }
        
        // Save original data for logging
        String originalRoomNumber = room.getRoomNumber();
        String originalType = room.getType();
        double originalPrice = room.getPricePerNight();
        
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setPricePerNight(request.getPrice());
        room.setIsAvailable(request.isAvailable());
        
        roomRepo.save(room);
        request.setId(room.getId()); // Ensure ID is returned
        
        logger.info("Room updated successfully: ID={}", room.getId());
        logger.debug("Room changes: number [{}->{}], type [{}->{}], price [${}->${}]",
                  originalRoomNumber, room.getRoomNumber(),
                  originalType, room.getType(),
                  originalPrice, room.getPricePerNight());
        
        return request;
    }
    
    // delete room by ID
    public void deleteRoomById(Long id) {
        logger.info("Deleting room with ID: {}", id);
        
        Room room = roomRepo.findById(id)
            .orElseThrow(() -> {
                logger.error("Room not found with ID: {}", id);
                return new AppExceptions.RoomNotFoundException("Room not found");
            });
        
        List<Reservation> reservations = reservationRepo.findByRoomId(id);
        if (!reservations.isEmpty()) {
            logger.warn("Cannot delete room {} - it has {} active reservations", 
                      room.getRoomNumber(), reservations.size());
            throw new AppExceptions.ActiveReservationsException("Cannot delete room with active reservations");
        }
        
        logger.debug("Deleting room: {}, type={}", room.getRoomNumber(), room.getType());
        roomRepo.deleteById(id);
        logger.info("Room deleted successfully");
    }
    
    // update reservation details
    public ReservationRequest updateReservation(Long id, ReservationRequest request) {
        logger.info("Updating reservation with ID: {}", id);
        logger.debug("Update details: guest={}, room ID={}, check-in={}, check-out={}",
                  request.getGuestName(), request.getRoomId(), 
                  request.getCheckInDate(), request.getCheckOutDate());
        
        Reservation reservation = reservationRepo.findById(id)
            .orElseThrow(() -> {
                logger.error("Reservation not found with ID: {}", id);
                return new AppExceptions.ReservationNotFoundException("Reservation not found");
            });
        
        Room room = roomRepo.findById(request.getRoomId())
            .orElseThrow(() -> {
                logger.error("Room not found with ID: {}", request.getRoomId());
                return new AppExceptions.RoomNotFoundException("Room not found");
            });

        // Check for overlapping bookings if room or dates change
        if (!reservation.getRoom().getId().equals(request.getRoomId()) ||
            !reservation.getCheckInDate().equals(request.getCheckInDate()) ||
            !reservation.getCheckOutDate().equals(request.getCheckOutDate())) {
            
            logger.debug("Checking for booking conflicts - room or dates have changed");
            List<Reservation> overlapping = reservationRepo.findOverlappingReservations(
                request.getCheckInDate(), request.getCheckOutDate());
            
            if (overlapping.stream().anyMatch(r -> r.getRoom().getId().equals(request.getRoomId()) && !r.getId().equals(id))) {
                logger.warn("Room {} is already booked for dates between {} and {}", 
                         room.getRoomNumber(), request.getCheckInDate(), request.getCheckOutDate());
                throw new AppExceptions.RoomAlreadyBookedException("Room is already booked for these dates");
            }
        }

        // Update room availability if room changes
        if (!reservation.getRoom().getId().equals(request.getRoomId())) {
            logger.debug("Room has changed from ID={} to ID={}, updating availability", 
                      reservation.getRoom().getId(), request.getRoomId());
            
            Room oldRoom = reservation.getRoom();
            oldRoom.setIsAvailable(true);
            roomRepo.save(oldRoom);
            logger.debug("Old room {} availability updated to true", oldRoom.getRoomNumber());
            
            room.setIsAvailable(false);
            roomRepo.save(room);
            logger.debug("New room {} availability updated to false", room.getRoomNumber());
        }

        // Save original data for logging
        String originalGuestName = reservation.getGuestName();
        LocalDate originalCheckIn = reservation.getCheckInDate();
        LocalDate originalCheckOut = reservation.getCheckOutDate();
        
        reservation.setGuestName(request.getGuestName());
        reservation.setGuestEmail(request.getGuestEmail());
        reservation.setRoom(room);
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        
        reservationRepo.save(reservation);
        request.setId(reservation.getId()); // Ensure ID is returned
        
        logger.info("Reservation updated successfully: ID={}", reservation.getId());
        logger.debug("Reservation changes: guest [{}->{}], dates [{}->{} to {}->{}, room={}]",
                  originalGuestName, reservation.getGuestName(),
                  originalCheckIn, reservation.getCheckInDate(),
                  originalCheckOut, reservation.getCheckOutDate(),
                  room.getRoomNumber());
        
        return request;
    }
 
    // delete reservation by ID
    public void deleteReservation(Long id) {
        logger.info("Deleting reservation with ID: {}", id);
        
        Reservation reservation = reservationRepo.findById(id)
            .orElseThrow(() -> {
                logger.error("Reservation not found with ID: {}", id);
                return new AppExceptions.ReservationNotFoundException("Reservation not found");
            });
        
        Room room = reservation.getRoom();
        room.setIsAvailable(true);
        roomRepo.save(room);
        logger.debug("Room {} availability updated to true", room.getRoomNumber());
        
        logger.debug("Deleting reservation for guest: {}, dates: {} to {}", 
                  reservation.getGuestName(), 
                  reservation.getCheckInDate(), 
                  reservation.getCheckOutDate());
        
        reservationRepo.deleteById(id);
        logger.info("Reservation deleted successfully");
    }

    // find reservation by ID
    public Reservation findById(Long reservationId) {
        logger.info("Finding reservation by ID: {}", reservationId);
        
        Reservation reservation = reservationRepo.findById(reservationId).orElse(null);
        
        if (reservation == null) {
            logger.warn("Reservation not found with ID: {}", reservationId);
        } else {
            logger.debug("Found reservation: guest={}, room={}, dates={} to {}", 
                      reservation.getGuestName(), 
                      reservation.getRoom().getRoomNumber(),
                      reservation.getCheckInDate(), 
                      reservation.getCheckOutDate());
        }
        
        return reservation;
    }

    // get all reservations
    public List<ReservationRequest> getAllReservations() {
        logger.info("Getting all reservations");
        
        List<Reservation> reservations = reservationRepo.findAll();
        logger.debug("Found {} reservations", reservations.size());
        
        List<ReservationRequest> requestList = reservations.stream()
            .map(reservation -> {
                ReservationRequest request = new ReservationRequest();
                request.setId(reservation.getId());
                request.setGuestName(reservation.getGuestName());
                request.setGuestEmail(reservation.getGuestEmail());
                request.setRoomId(reservation.getRoom().getId());
                request.setCheckInDate(reservation.getCheckInDate());
                request.setCheckOutDate(reservation.getCheckOutDate());
                return request;
            })
            .collect(Collectors.toList());
        
        logger.debug("Transformed {} reservations to DTOs", requestList.size());
        return requestList;
    }

    // get all rooms
    public List<Room> getAllRooms() {
        logger.info("Getting all rooms");
        return roomRepo.findAll();
    }
}