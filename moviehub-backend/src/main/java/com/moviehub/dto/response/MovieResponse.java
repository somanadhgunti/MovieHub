package com.moviehub.dto.response;

import com.moviehub.enums.MovieStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {

    private Long id;

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

    private MovieStatus status;
}