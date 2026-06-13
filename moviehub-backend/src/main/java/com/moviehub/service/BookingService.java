package com.moviehub.service;

import com.moviehub.dto.request.BookingRequest;
import com.moviehub.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(
            BookingRequest request);

    BookingResponse getBookingById(
            Long bookingId);

    List<BookingResponse> getBookingsByUser(
            Long userId);
}