package com.moviehub.dto.response;

import com.moviehub.enums.BookingStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long bookingId;

    private String bookingNumber;

    private Integer totalSeats;

    private BigDecimal totalAmount;

    private BookingStatus bookingStatus;

    private String message;
}