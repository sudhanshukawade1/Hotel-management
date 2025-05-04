package com.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Staff {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(unique = true)
	private String name ;
	private  String role; // CHEF , HOUSEKEEPING , etc;
	private boolean onDuty;
	
	public Staff() {
		
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public boolean isOnDuty() {
		return onDuty;
	}
	public void setOnDuty(boolean onDuty) {
		this.onDuty = onDuty;
	}
	public Staff(long id, String name, String role, boolean onDuty) {
		this.id = id;
		this.name = name;
		this.role = role;
		this.onDuty = onDuty;
	}
	
	

}
