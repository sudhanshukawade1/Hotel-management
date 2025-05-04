package com.dto;

import lombok.Data;

@Data
public class RoomRequest {
	private Long id;
    private String roomNumber;
    private String type;
    private double price; // Maps to pricePerNight
    private boolean available; // Maps to isAvailable
    
    public RoomRequest(Long id, String roomNumber, String type, double price, boolean available) {
		super();
		this.id = id;
		this.roomNumber = roomNumber;
		this.type = type;
		this.price = price;
		this.available = available;
	}
    
    public RoomRequest() {
    	
    }
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getRoomNumber() {
		return roomNumber;
	}
	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public boolean isAvailable() {
		return available;
	}
	public void setAvailable(boolean available) {
		this.available = available;
	}
	
}