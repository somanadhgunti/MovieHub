package com.moviehub.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieRequest {

    private String title;
    private String description;
    private String genre;
    private String language;
    private Integer duration;
    private String releaseDate;
    private Double rating;
    private String posterUrl;
    private String trailerUrl;
    private String castMembers;
    private String director;
}