package com.repository;

import com.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Existing method (assumed from your service)
    @Query("SELECT r FROM Reservation r WHERE " +
           "(r.checkInDate < :checkOut AND r.checkOutDate > :checkIn)")

    // Find overlapping reservations
    List<Reservation> findOverlappingReservations(@Param("checkIn") LocalDate checkIn,
                                                  @Param("checkOut") LocalDate checkOut);

    // New method to find reservations by room ID
    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId")

    // Find reservations by roomID
    List<Reservation> findByRoomId(@Param("roomId") Long roomId);
}