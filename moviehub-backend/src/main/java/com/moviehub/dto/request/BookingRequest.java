package com.moviehub.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    private Long userId;

    private Long showId;

    private List<Long> showSeatIds;
}