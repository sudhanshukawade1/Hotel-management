package com.example.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "reservation-service")
public interface ReservationClient {
    @GetMapping("/reservation/details/{reservationId}")
    Map<String, Object> getReservationDetails(
        @PathVariable("reservationId") Long reservationId,
        @RequestHeader("Authorization") String authHeader,
        @RequestHeader("X-User-Role") String role,
        @RequestHeader("X-User-Email") String email
    );
    
    @GetMapping("/reservation/details/{reservationId}")
    Map<String, Object> getReservationById(
        @PathVariable("reservationId") Long reservationId
    );
}