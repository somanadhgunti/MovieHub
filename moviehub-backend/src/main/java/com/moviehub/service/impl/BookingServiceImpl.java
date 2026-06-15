package com.moviehub.service.impl;

import com.moviehub.dto.request.BookingRequest;
import com.moviehub.dto.response.BookingResponse;
import com.moviehub.entity.*;
import com.moviehub.enums.BookingStatus;
import com.moviehub.enums.SeatStatus;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.*;
import com.moviehub.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

        private final BookingRepository bookingRepository;
        private final BookingSeatRepository bookingSeatRepository;
        private final UserRepository userRepository;
        private final ShowRepository showRepository;
        private final ShowSeatRepository showSeatRepository;

        @Override
        public BookingResponse createBooking(
                        BookingRequest request) {

                System.out.println("================================");
                System.out.println("User Id: " + request.getUserId());
                System.out.println("Show Id: " + request.getShowId());
                System.out.println("Show Seat Ids: " + request.getShowSeatIds());
                System.out.println("================================");

                User user = userRepository.findById(
                                request.getUserId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                Show show = showRepository.findById(
                                request.getShowId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Show not found"));

                List<ShowSeat> selectedSeats = showSeatRepository.findAllById(
                                request.getShowSeatIds());

                System.out.println("Fetched Seats:");

                for (ShowSeat seat : selectedSeats) {

                        System.out.println(
                                        "Seat ID = "
                                                        + seat.getId()
                                                        + " Status = "
                                                        + seat.getStatus());

                        if (seat.getStatus() != SeatStatus.AVAILABLE) {

                                throw new RuntimeException(
                                                "Seat already booked: "
                                                                + seat.getId());
                        }
                }

                BigDecimal totalAmount = selectedSeats.stream()
                                .map(ShowSeat::getPrice)
                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                Booking booking = Booking.builder()
                                .bookingNumber(
                                                "BK-" +
                                                                UUID.randomUUID()
                                                                                .toString()
                                                                                .substring(0, 8))
                                .totalSeats(selectedSeats.size())
                                .totalAmount(totalAmount)
                                .bookingStatus(
                                                BookingStatus.CONFIRMED)
                                .bookingTime(
                                                LocalDateTime.now())
                                .user(user)
                                .show(show)
                                .build();

                bookingRepository.save(booking);

                for (ShowSeat seat : selectedSeats) {

                        seat.setStatus(
                                        SeatStatus.BOOKED);

                        showSeatRepository.save(seat);

                        BookingSeat bookingSeat = BookingSeat.builder()
                                        .booking(booking)
                                        .showSeat(seat)
                                        .build();

                        bookingSeatRepository.save(
                                        bookingSeat);
                }

                return BookingResponse.builder()
                                .bookingId(
                                                booking.getId())
                                .bookingNumber(
                                                booking.getBookingNumber())
                                .totalSeats(
                                                booking.getTotalSeats())
                                .totalAmount(
                                                booking.getTotalAmount())
                                .bookingStatus(
                                                booking.getBookingStatus())
                                .message(
                                                "Booking Successful")
                                .build();
        }

        @Override
        public BookingResponse getBookingById(
                        Long bookingId) {

                Booking booking = bookingRepository.findById(
                                bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Booking not found"));

                return BookingResponse.builder()
                                .bookingId(
                                                booking.getId())
                                .bookingNumber(
                                                booking.getBookingNumber())
                                .totalSeats(
                                                booking.getTotalSeats())
                                .totalAmount(
                                                booking.getTotalAmount())
                                .bookingStatus(
                                                booking.getBookingStatus())
                                .message(
                                                "Booking Found")
                                .build();
        }

        @Override
        public List<BookingResponse> getBookingsByUser(
                        Long userId) {

                return bookingRepository.findByUserId(userId)
                                .stream()
                                .map(booking -> BookingResponse.builder()
                                                .bookingId(
                                                                booking.getId())
                                                .bookingNumber(
                                                                booking.getBookingNumber())
                                                .totalSeats(
                                                                booking.getTotalSeats())
                                                .totalAmount(
                                                                booking.getTotalAmount())
                                                .bookingStatus(
                                                                booking.getBookingStatus())
                                                .message(
                                                                "Success")
                                                .build())
                                .toList();
        }

        @Override
        public List<BookingResponse> getAllBookings() {
                return bookingRepository.findAll()
                                .stream()
                                .map(booking -> BookingResponse.builder()
                                                .bookingId(
                                                                booking.getId())
                                                .bookingNumber(
                                                                booking.getBookingNumber())
                                                .totalSeats(
                                                                booking.getTotalSeats())
                                                .totalAmount(
                                                                booking.getTotalAmount())
                                                .bookingStatus(
                                                                booking.getBookingStatus())
                                                .message(
                                                                "Success")
                                                .build())
                                .toList();
        }
}