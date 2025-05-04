package com.example.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"reservationId", "status"}, 
                     name = "unique_reservation_success_constraint")
})
public class Payment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long reservationId;
    private String guestName;
    private double amount;
    private String status; // "SUCCESS" or "FAILED"
    private String processedBy; // e.g., "RECEPTIONIST tempo@gmail.com"
    public Long getId() {
		return id;
	}
    
	public Payment(Long id, Long reservationId, String guestName, double amount, String status, String processedBy) {
		super();
		this.id = id;
		this.reservationId = reservationId;
		this.guestName = guestName;
		this.amount = amount;
		this.status = status;
		this.processedBy = processedBy;
	}
	
	public Payment() {
		
	}

	public void setId(Long id) {
		this.id = id;
	}
	public Long getReservationId() {
		return reservationId;
	}
	public void setReservationId(Long reservationId) {
		this.reservationId = reservationId;
	}
	public String getGuestName() {
		return guestName;
	}
	public void setGuestName(String guestName) {
		this.guestName = guestName;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getProcessedBy() {
		return processedBy;
	}
	public void setProcessedBy(String processedBy) {
		this.processedBy = processedBy;
	}
	
}