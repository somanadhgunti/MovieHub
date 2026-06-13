package com.moviehub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.moviehub.enums.TicketStatus;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String ticketNumber;

    private String qrCode;

    @Enumerated(EnumType.STRING)
    private TicketStatus ticketStatus;

    private LocalDateTime issuedAt;

    private LocalDateTime validUntil;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "show_seat_id")
    private ShowSeat showSeat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    private Booking booking;
}