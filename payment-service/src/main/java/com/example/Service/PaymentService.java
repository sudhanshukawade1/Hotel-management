package com.example.Service;

import com.example.client.ReservationClient;
import com.example.Model.Payment;
import com.example.Repository.PaymentRepository;
import com.example.exception.AppExceptions;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    @Autowired
    private ReservationClient reservationClient;
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(Long reservationId, String role, String email, String authHeader) {
        String processedBy = role + " " + email;
        
        // First check if reservation exists
        Map<String, Object> reservationDetails = null;
        try {
            reservationDetails = reservationClient.getReservationDetails(reservationId, authHeader, role, email);
            if (reservationDetails == null || reservationDetails.isEmpty()) {
                logger.error("Reservation not found for ID: {}", reservationId);
                throw new AppExceptions.ReservationNotFoundException("Reservation not found. Cannot process payment.");
            }
            
            // Add debug logging
            logger.debug("Reservation details received: {}", reservationDetails);
            logger.debug("Price field: {}, Type: {}", 
                reservationDetails.get("price"), 
                reservationDetails.get("price") != null ? reservationDetails.get("price").getClass().getName() : "null");
        } catch (Exception e) {
            logger.error("Error fetching reservation details: {}", e.getMessage());
            throw new AppExceptions.PaymentVerificationException("Unable to verify reservation: " + e.getMessage());
        }
        
        // Now check if payment already exists
        Optional<Payment> existingPayment = paymentRepository.findByReservationIdAndStatus(reservationId, "SUCCESS");
        if (existingPayment.isPresent()) {
            logger.info("Payment already processed successfully for reservation: {}", reservationId);
            throw new AppExceptions.PaymentAlreadyProcessedException("Payment already processed for this reservation");
        }
        
        Payment payment = new Payment();
        payment.setReservationId(reservationId);
        
        try {
            String guestName = (String) reservationDetails.get("guestName");
            payment.setGuestName(guestName != null ? guestName : "Unknown");
            
            // Try different possible field names for price
            Object price = null;
            String[] possiblePriceFields = {"Price", "price", "totalPrice", "amount", "total", "cost", "roomPrice", "totalAmount"};
            
            for (String field : possiblePriceFields) {
                price = reservationDetails.get(field);
                if (price != null) {
                    logger.debug("Found price in field '{}': {}", field, price);
                    break;
                }
            }
            
            double amount = 0.0;
            
            if (price instanceof Number) {
                amount = ((Number) price).doubleValue();
                logger.debug("Extracted amount as Number: {}", amount);
            } else if (price instanceof String) {
                try {
                    amount = Double.parseDouble((String) price);
                    logger.debug("Extracted amount from String: {}", amount);
                } catch (NumberFormatException e) {
                    logger.error("Invalid price format: {}", price);
                }
            } else if (price instanceof Map) {
                // Check if price is in a nested structure
                try {
                    Map<String, Object> priceMap = (Map<String, Object>) price;
                    if (priceMap.containsKey("amount")) {
                        Object amountObj = priceMap.get("amount");
                        if (amountObj instanceof Number) {
                            amount = ((Number) amountObj).doubleValue();
                        } else if (amountObj instanceof String) {
                            amount = Double.parseDouble((String) amountObj);
                        }
                        logger.debug("Extracted amount from nested Map: {}", amount);
                    }
                } catch (Exception e) {
                    logger.error("Error extracting price from Map: {}", e.getMessage());
                }
            } else {
                logger.warn("Price field not found or has unexpected type in reservation details");
            }
            
            if (amount <= 0.0) {
                logger.warn("Amount is still zero or negative after extraction attempts. Reservation details keys: {}", 
                    reservationDetails.keySet());
            } else {
                logger.info("Successfully extracted amount: {} from reservation details", amount);
            }
            
            payment.setAmount(amount);
            payment.setStatus("SUCCESS");
            payment.setProcessedBy(processedBy);
            
            try {
                return paymentRepository.save(payment);
            } catch (DataIntegrityViolationException e) {
                // Handle the case where another thread/request created a payment after our initial check
                logger.warn("Concurrent payment attempt detected for reservation: {}", reservationId);
                throw new AppExceptions.PaymentAlreadyProcessedException("Payment was already processed by another request");
            }
        } catch (Exception e) {
            if (e instanceof RuntimeException && e.getMessage().contains("Payment already processed")) {
                throw e;
            }
            logger.error("Error processing payment: {}", e.getMessage());
            payment.setStatus("FAILED");
            payment.setAmount(0.0);
            payment.setGuestName("Unknown");
            return paymentRepository.save(payment);
        }
    }
}