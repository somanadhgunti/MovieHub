package com.moviehub.service.impl;

import com.moviehub.dto.request.ShowRequest;
import com.moviehub.dto.response.ShowResponse;
import com.moviehub.entity.Movie;
import com.moviehub.entity.Screen;
import com.moviehub.entity.Show;
import com.moviehub.enums.ShowStatus;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.MovieRepository;
import com.moviehub.repository.ScreenRepository;
import com.moviehub.repository.ShowRepository;
import com.moviehub.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowServiceImpl implements ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;

    @Override
    public ShowResponse createShow(ShowRequest request) {

        Movie movie = movieRepository.findById(
                request.getMovieId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Movie not found"));

        Screen screen = screenRepository.findById(
                request.getScreenId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Screen not found"));

        Show show = Show.builder()
                .movie(movie)
                .screen(screen)
                .showDate(LocalDate.parse(request.getShowDate()))
                .startTime(LocalTime.parse(request.getStartTime()))
                .endTime(LocalTime.parse(request.getEndTime()))
                .basePrice(request.getBasePrice())
                .status(ShowStatus.SCHEDULED)
                .build();

        showRepository.save(show);

        return mapToResponse(show);
    }

    @Override
    public List<ShowResponse> getAllShows() {

        return showRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ShowResponse getShowById(Long id) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Show not found"));

        return mapToResponse(show);
    }

    @Override
    public ShowResponse updateShow(
            Long id,
            ShowRequest request) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Show not found"));

        Movie movie = movieRepository.findById(
                request.getMovieId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Movie not found"));

        Screen screen = screenRepository.findById(
                request.getScreenId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Screen not found"));

        show.setMovie(movie);
        show.setScreen(screen);
        show.setShowDate(LocalDate.parse(request.getShowDate()));
        show.setStartTime(LocalTime.parse(request.getStartTime()));
        show.setEndTime(LocalTime.parse(request.getEndTime()));
        show.setBasePrice(request.getBasePrice());

        showRepository.save(show);

        return mapToResponse(show);
    }

    @Override
    public void deleteShow(Long id) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Show not found"));

        showRepository.delete(show);
    }

    private ShowResponse mapToResponse(Show show) {

        return ShowResponse.builder()
                .id(show.getId())
                .movieId(show.getMovie().getId())
                .movieTitle(show.getMovie().getTitle())
                .screenId(show.getScreen().getId())
                .screenName(show.getScreen().getName())
                .showDate(show.getShowDate().toString())
                .startTime(show.getStartTime().toString())
                .endTime(show.getEndTime().toString())
                .basePrice(show.getBasePrice())
                .status(show.getStatus())
                .build();
    }
}