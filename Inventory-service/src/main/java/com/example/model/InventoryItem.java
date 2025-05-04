package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class InventoryItem {
	
	@Id
	@GeneratedValue(strategy  = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
	private String name;
	private int quantity;
	private String category;
	
	public InventoryItem() {
		
	}
	
	public InventoryItem(Long id, String name , int quantity, String category) {
		this.id = id;
		this.name = name;
		this.quantity = quantity;
		this.category = category;
	}
			
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}

}
