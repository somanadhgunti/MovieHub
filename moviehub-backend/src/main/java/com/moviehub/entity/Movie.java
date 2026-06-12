package com.moviehub.entity;

import com.moviehub.enums.MovieStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String genre;

    private String language;

    private Integer duration;

    private LocalDate releaseDate;

    private Double rating;

    private String posterUrl;

    private String trailerUrl;

    @Column(columnDefinition = "TEXT")
    private String castMembers;;

    private String director;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;
}