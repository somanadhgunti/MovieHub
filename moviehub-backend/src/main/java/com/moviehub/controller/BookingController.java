package com.moviehub.controller;

import com.moviehub.dto.request.BookingRequest;
import com.moviehub.dto.response.BookingResponse;
import com.moviehub.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponse createBooking(
            @RequestBody BookingRequest request) {

        return bookingService.createBooking(
                request);
    }

    @GetMapping("/{bookingId}")
    public BookingResponse getBookingById(
            @PathVariable Long bookingId) {

        return bookingService.getBookingById(
                bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<BookingResponse> getBookingsByUser(
            @PathVariable Long userId) {

        return bookingService.getBookingsByUser(
                userId);
    }

    @GetMapping
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }
}