package com.example.util;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;


@Component
public class JwtUtil {
	
	public static final String SECRET = "aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcdefghijklmn";
	
    // validates a JWT token
	public void validateToken(final String token) {
		Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token);
    }
	
	// New method to extract the role from the token
    public String getRoleFromToken(final String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        String role = claims.get("roles", String.class); // Fetch "roles" instead of "role"
        if (role != null && role.startsWith("ROLE_")) {
            return role.substring(5); // Remove "ROLE_" prefix, e.g., "ROLE_RECEPTIONIST" → "RECEPTIONIST"
        }
        return role; // Return as-is if no prefix
    }
	
    // Exttracts the email from the token
    public String getEmailFromToken(final String token) {
        Claims claims = getClaims(token);
        return claims.getSubject(); // "sub" claim, e.g., "tempo@gmail.com"
    }
    
    // Extracts all claims from the token
    private Claims getClaims(final String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    // Returns the singing key for JWT validation
	private Key getSignKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
	}
