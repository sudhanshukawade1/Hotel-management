package com.dto;





import com.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    
    
    private Role role;
    private String password;
    
    public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	
}
    