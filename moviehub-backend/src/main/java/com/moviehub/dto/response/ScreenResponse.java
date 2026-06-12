package com.moviehub.dto.response;

import com.moviehub.enums.ScreenType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreenResponse {

    private Long id;

    private Integer screenNumber;

    private String name;

    private Integer totalRows;

    private Integer totalColumns;

    private Integer totalSeats;

    private ScreenType screenType;

    private Long theatreId;

    private String theatreName;
}