package com.moviehub.service.impl;

import com.moviehub.dto.response.TicketResponse;
import com.moviehub.entity.Booking;
import com.moviehub.entity.BookingSeat;
import com.moviehub.entity.Ticket;
import com.moviehub.enums.TicketStatus;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.BookingRepository;
import com.moviehub.repository.BookingSeatRepository;
import com.moviehub.repository.TicketRepository;
import com.moviehub.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @Override
    public List<TicketResponse> generateTickets(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found"));

        List<BookingSeat> bookingSeats =
                bookingSeatRepository.findByBookingId(
                        bookingId);

        for (BookingSeat bookingSeat : bookingSeats) {

            Ticket ticket = Ticket.builder()
                    .ticketNumber(
                            "TK-" +
                            UUID.randomUUID()
                                    .toString()
                                    .substring(0, 8))
                    .qrCode(
                            UUID.randomUUID()
                                    .toString())
                    .ticketStatus(
                            TicketStatus.VALID)
                    .issuedAt(
                            LocalDateTime.now())
                    .validUntil(
                            booking.getShow()
                                    .getShowDate()
                                    .atTime(
                                            booking.getShow()
                                                    .getEndTime()))
                    .booking(booking)
                    .showSeat(
                            bookingSeat.getShowSeat())
                    .build();

            ticketRepository.save(ticket);
        }

        return getTicketsByBooking(
                bookingId);
    }

    @Override
    public List<TicketResponse> getTicketsByBooking(
            Long bookingId) {

        return ticketRepository.findByBookingId(
                        bookingId)
                .stream()
                .map(ticket ->
                        TicketResponse.builder()
                                .ticketId(
                                        ticket.getId())
                                .ticketNumber(
                                        ticket.getTicketNumber())
                                .qrCode(
                                        ticket.getQrCode())
                                .ticketStatus(
                                        ticket.getTicketStatus())
                                .bookingId(
                                        ticket.getBooking()
                                                .getId())
                                .showSeatId(
                                        ticket.getShowSeat()
                                                .getId())
                                .build())
                .toList();
    }
}