package com.moviehub.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreRequest {

    private String name;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String phoneNumber;

    private String email;

    private Integer totalScreens;

    private String amenities;
}