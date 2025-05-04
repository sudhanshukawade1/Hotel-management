package com.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public class BookingDTO {
    private Long id;
    private Long guestId;
    private String guestName;
    private Long roomId;
    private String roomNumber;
    @NotNull
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalPrice;
    private String status;

    public BookingDTO() {
    }

    public BookingDTO(Long id, Long guestId, String guestName, Long roomId, String roomNumber, 
                      LocalDate checkInDate, LocalDate checkOutDate, Double totalPrice, String status) {
        this.id = id;
        this.guestId = guestId;
        this.guestName = guestName;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGuestId() {
        return guestId;
    }

    public void setGuestId(Long guestId) {
        this.guestId = guestId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
} 