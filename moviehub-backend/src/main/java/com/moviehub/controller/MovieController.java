package com.moviehub.controller;

import com.moviehub.dto.request.MovieRequest;
import com.moviehub.dto.response.MovieResponse;
import com.moviehub.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    public MovieResponse createMovie(
            @RequestBody MovieRequest request) {

        return movieService.createMovie(request);
    }

    @GetMapping
    public List<MovieResponse> getAllMovies() {

        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public MovieResponse getMovieById(
            @PathVariable Long id) {

        return movieService.getMovieById(id);
    }

    @PutMapping("/{id}")
    public MovieResponse updateMovie(
            @PathVariable Long id,
            @RequestBody MovieRequest request) {

        return movieService.updateMovie(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteMovie(
            @PathVariable Long id) {

        movieService.deleteMovie(id);

        return "Movie Deleted Successfully";
    }
}