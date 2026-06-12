package com.moviehub.dto.response;

import com.moviehub.enums.ShowStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowResponse {

    private Long id;

    private Long movieId;

    private String movieTitle;

    private Long screenId;

    private String screenName;

    private String showDate;

    private String startTime;

    private String endTime;

    private BigDecimal basePrice;

    private ShowStatus status;
}