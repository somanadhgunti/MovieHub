package com.moviehub.dto.response;

import com.moviehub.enums.TheatreStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreResponse {

    private Long id;

    private String name;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String phoneNumber;

    private String email;

    private Integer totalScreens;

    private String amenities;

    private TheatreStatus status;
}