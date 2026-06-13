package com.moviehub.service;

import com.moviehub.dto.response.TicketResponse;

import java.util.List;

public interface TicketService {

    List<TicketResponse> generateTickets(
            Long bookingId);

    List<TicketResponse> getTicketsByBooking(
            Long bookingId);
}