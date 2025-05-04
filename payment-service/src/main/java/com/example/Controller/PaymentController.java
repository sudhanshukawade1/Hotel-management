package com.example.Controller;

import com.example.Model.Payment;
import com.example.Service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/payment")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(
            @RequestBody Map<String, Long> request,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Email") String email,
            @RequestHeader("Authorization") String authHeader) {
        logger.info("Processing payment request for reservationId: {}, role: {}, email: {}", 
            request.get("reservationId"), role, email);

        List<String> allowedRoles = List.of("OWNER", "MANAGER", "RECEPTIONIST");
        if (!allowedRoles.contains(role)) {
            logger.warn("Unauthorized role: {}", role);
            return new ResponseEntity<>(Map.of("message", "Requires OWNER, MANAGER, or RECEPTIONIST role"), HttpStatus.FORBIDDEN);
        }

        Long reservationId = request.get("reservationId");
        if (reservationId == null) {
            logger.error("Missing reservationId in request");
            return new ResponseEntity<>(Map.of("message", "Reservation ID is required"), HttpStatus.BAD_REQUEST);
        }

        try {
            Payment payment = paymentService.processPayment(reservationId, role, email, authHeader);
            logger.info("Payment processed successfully: paymentId={}, reservationId={}", payment.getId(), reservationId);
            return ResponseEntity.ok(Map.of(
                "paymentId", payment.getId(),
                "reservationId", payment.getReservationId(),
                "guestName", payment.getGuestName(),
                "amount", payment.getAmount(),
                "status", payment.getStatus(),
                "message", "Payment processed by " + payment.getProcessedBy()
            ));
        } catch (RuntimeException e) {
            logger.error("Payment processing failed: {}", e.getMessage());
            
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            
            // Determine appropriate status code based on error message
            if (e.getMessage().contains("not found")) {
                status = HttpStatus.NOT_FOUND;
            } else if (e.getMessage().contains("already processed")) {
                status = HttpStatus.CONFLICT;
            }
            
            return new ResponseEntity<>(Map.of(
                "message", e.getMessage(),
                "status", "FAILED"
            ), status);
        }
    }
}