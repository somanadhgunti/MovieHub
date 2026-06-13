package com.moviehub.controller;

import com.moviehub.dto.response.TicketResponse;
import com.moviehub.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/generate/{bookingId}")
    public List<TicketResponse> generateTickets(
            @PathVariable Long bookingId) {

        return ticketService.generateTickets(
                bookingId);
    }

    @GetMapping("/booking/{bookingId}")
    public List<TicketResponse> getTicketsByBooking(
            @PathVariable Long bookingId) {

        return ticketService.getTicketsByBooking(
                bookingId);
    }
}