package com.example.dto;

import lombok.Data;

@Data
public class StaffDTO {
    private Long id;
    private String name;
    private String role;
    private boolean onDuty;
    
    public StaffDTO() {
    }
    
    public StaffDTO(Long id, String name, String role, boolean onDuty) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.onDuty = onDuty;
    }
    
    // Getters and setters
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
} 