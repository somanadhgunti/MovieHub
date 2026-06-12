package com.moviehub.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowRequest {

    private Long movieId;

    private Long screenId;

    private String showDate;

    private String startTime;

    private String endTime;

    private BigDecimal basePrice;
}