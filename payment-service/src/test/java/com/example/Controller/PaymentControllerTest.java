package com.example.Controller;

import com.example.Model.Payment;
import com.example.Service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    private Payment payment;
    private Map<String, Long> requestBody;
    private final Long RESERVATION_ID = 1L;
    private final String ROLE = "RECEPTIONIST";
    private final String EMAIL = "test@example.com";
    private final String AUTH_HEADER = "Bearer token";

    @BeforeEach
    void setUp() {
        // Setup payment
        payment = new Payment();
        payment.setId(1L);
        payment.setReservationId(RESERVATION_ID);
        payment.setGuestName("John Doe");
        payment.setAmount(150.0);
        payment.setStatus("SUCCESS");
        payment.setProcessedBy(ROLE + " " + EMAIL);

        // Setup request body
        requestBody = new HashMap<>();
        requestBody.put("reservationId", RESERVATION_ID);
    }

    @Test
    void processPayment_Success() throws Exception {
        // Arrange
        when(paymentService.processPayment(eq(RESERVATION_ID), eq(ROLE), eq(EMAIL), eq(AUTH_HEADER)))
                .thenReturn(payment);

        // Act & Assert
        mockMvc.perform(post("/payment/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody))
                .header("X-User-Role", ROLE)
                .header("X-User-Email", EMAIL)
                .header("Authorization", AUTH_HEADER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentId", is(1)))
                .andExpect(jsonPath("$.reservationId", is(1)))
                .andExpect(jsonPath("$.guestName", is("John Doe")))
                .andExpect(jsonPath("$.amount", is(150.0)))
                .andExpect(jsonPath("$.status", is("SUCCESS")))
                .andExpect(jsonPath("$.message", is("Payment processed by " + payment.getProcessedBy())));
    }

    @Test
    void processPayment_UnauthorizedRole() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/payment/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody))
                .header("X-User-Role", "GUEST")
                .header("X-User-Email", EMAIL)
                .header("Authorization", AUTH_HEADER))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message", is("Requires OWNER, MANAGER, or RECEPTIONIST role")));
    }

    @Test
    void processPayment_MissingReservationId() throws Exception {
        // Setup empty request
        Map<String, Long> emptyRequest = new HashMap<>();

        // Act & Assert
        mockMvc.perform(post("/payment/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyRequest))
                .header("X-User-Role", ROLE)
                .header("X-User-Email", EMAIL)
                .header("Authorization", AUTH_HEADER))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Reservation ID is required")));
    }

    @Test
    void processPayment_ServiceThrowsException() throws Exception {
        // Arrange
        when(paymentService.processPayment(eq(RESERVATION_ID), eq(ROLE), eq(EMAIL), eq(AUTH_HEADER)))
                .thenThrow(new RuntimeException("Payment processing failed"));

        // Act & Assert
        mockMvc.perform(post("/payment/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody))
                .header("X-User-Role", ROLE)
                .header("X-User-Email", EMAIL)
                .header("Authorization", AUTH_HEADER))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message", is("Payment processing failed")))
                .andExpect(jsonPath("$.status", is("FAILED")));
    }
} 