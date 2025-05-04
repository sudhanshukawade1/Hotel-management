package com.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find rooms by availability
    List<Room> findByAvailable(Boolean available);
    
    // check if a room exists by room number
    boolean existsByRoomNumber(String roomNumber);
}
