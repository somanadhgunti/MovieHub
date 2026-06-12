package com.moviehub.service;

import com.moviehub.dto.request.MovieRequest;
import com.moviehub.dto.response.MovieResponse;

import java.util.List;

public interface MovieService {

    MovieResponse createMovie(MovieRequest request);

    List<MovieResponse> getAllMovies();

    MovieResponse getMovieById(Long id);

    MovieResponse updateMovie(Long id, MovieRequest request);

    void deleteMovie(Long id);
}