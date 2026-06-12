package com.moviehub.service.impl;

import com.moviehub.dto.request.MovieRequest;
import com.moviehub.dto.response.MovieResponse;
import com.moviehub.entity.Movie;
import com.moviehub.enums.MovieStatus;
import com.moviehub.exception.ResourceAlreadyExistsException;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.MovieRepository;
import com.moviehub.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    @Override
    public MovieResponse createMovie(MovieRequest request) {

        if (movieRepository.existsByTitle(request.getTitle())) {
            throw new ResourceAlreadyExistsException(
                    "Movie already exists");
        }

        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .language(request.getLanguage())
                .duration(request.getDuration())
                .releaseDate(LocalDate.parse(request.getReleaseDate()))
                .rating(request.getRating())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .castMembers(request.getCastMembers())
                .director(request.getDirector())
                .status(MovieStatus.NOW_SHOWING)
                .build();

        movieRepository.save(movie);

        return mapToResponse(movie);
    }

    @Override
    public List<MovieResponse> getAllMovies() {

        return movieRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public MovieResponse getMovieById(Long id) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Movie not found"));

        return mapToResponse(movie);
    }

    @Override
    public MovieResponse updateMovie(Long id,
                                     MovieRequest request) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Movie not found"));

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setGenre(request.getGenre());
        movie.setLanguage(request.getLanguage());
        movie.setDuration(request.getDuration());
        movie.setReleaseDate(
                LocalDate.parse(request.getReleaseDate()));
        movie.setRating(request.getRating());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setCastMembers(request.getCastMembers());
        movie.setDirector(request.getDirector());

        movieRepository.save(movie);

        return mapToResponse(movie);
    }

    @Override
    public void deleteMovie(Long id) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Movie not found"));

        movieRepository.delete(movie);
    }

    private MovieResponse mapToResponse(Movie movie) {

        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .duration(movie.getDuration())
                .releaseDate(
                        movie.getReleaseDate().toString())
                .rating(movie.getRating())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .castMembers(movie.getCastMembers())
                .director(movie.getDirector())
                .status(movie.getStatus())
                .build();
    }
}