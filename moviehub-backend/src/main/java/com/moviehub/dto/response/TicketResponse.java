package com.moviehub.dto.response;

import com.moviehub.enums.TicketStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {

    private Long ticketId;

    private String ticketNumber;

    private String qrCode;

    private TicketStatus ticketStatus;

    private Long bookingId;

    private Long showSeatId;
}