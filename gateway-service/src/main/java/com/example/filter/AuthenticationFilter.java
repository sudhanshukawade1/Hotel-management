package com.example.filter;

import com.example.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {
    @Autowired
    private RouteValidator validator;
    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }
    
    // Applies the authentication filter to the incoming request
    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new RuntimeException("Missing authorization header");
                }
                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }
                try {
                    jwtUtil.validateToken(authHeader);
                    String role = jwtUtil.getRoleFromToken(authHeader); // e.g., "RECEPTIONIST"
                    String email = jwtUtil.getEmailFromToken(authHeader); // 
                    System.out.println("Extracted role: " + role + ", email: " + email); // Debug
                    exchange.getRequest().mutate()
                        .header("X-User-Role", role)
                        .header("X-User-Email", email) // Add email header
                        .build();
                    System.out.println("Headers after mutation: " + exchange.getRequest().getHeaders()); // Debug
                } catch (Exception e) {
                    System.out.println("Validation failed: " + e.getMessage());
                    throw new RuntimeException("Unauthorized access to application");
                }
            }
            return chain.filter(exchange);
        });
    }

    public static class Config {}
}