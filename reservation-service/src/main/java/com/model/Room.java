package com.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity

public class Room {
	@Id
	@GeneratedValue(strategy  = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
	private String roomNumber;
	
	private String type ;
	private double price;
	private Boolean available = true; 
	public Room(Long id, String roomNumber, String type, double price, Boolean available) {
		
		this.id = id;
		this.roomNumber = roomNumber;
		this.type = type;
		this.price = price;
		this.available = available;
	}
	
	public Room() {
		
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
	public double getPricePerNight() {
		return price;
	}
	public void setPricePerNight(double pricePerNight) {
		this.price = pricePerNight;
	}
	public Boolean getIsAvailable() {
		return available;
	}
	public void setIsAvailable(Boolean isAvailable) {
		this.available = isAvailable;
	}
	
	
}
