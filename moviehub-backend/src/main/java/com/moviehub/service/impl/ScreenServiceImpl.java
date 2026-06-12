package com.moviehub.service.impl;

import com.moviehub.dto.request.ScreenRequest;
import com.moviehub.dto.response.ScreenResponse;
import com.moviehub.entity.Screen;
import com.moviehub.entity.Theatre;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.ScreenRepository;
import com.moviehub.repository.TheatreRepository;
import com.moviehub.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScreenServiceImpl implements ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;

    @Override
    public ScreenResponse createScreen(ScreenRequest request) {

        Theatre theatre = theatreRepository.findById(
                request.getTheatreId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Theatre not found"));

        Screen screen = Screen.builder()
                .screenNumber(request.getScreenNumber())
                .name(request.getName())
                .totalRows(request.getTotalRows())
                .totalColumns(request.getTotalColumns())
                .totalSeats(request.getTotalSeats())
                .screenType(request.getScreenType())
                .theatre(theatre)
                .build();

        screenRepository.save(screen);

        return mapToResponse(screen);
    }

    @Override
    public List<ScreenResponse> getAllScreens() {

        return screenRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ScreenResponse getScreenById(Long id) {

        Screen screen = screenRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Screen not found"));

        return mapToResponse(screen);
    }

    @Override
    public ScreenResponse updateScreen(
            Long id,
            ScreenRequest request) {

        Screen screen = screenRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Screen not found"));

        Theatre theatre = theatreRepository.findById(
                request.getTheatreId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Theatre not found"));

        screen.setScreenNumber(request.getScreenNumber());
        screen.setName(request.getName());
        screen.setTotalRows(request.getTotalRows());
        screen.setTotalColumns(request.getTotalColumns());
        screen.setTotalSeats(request.getTotalSeats());
        screen.setScreenType(request.getScreenType());
        screen.setTheatre(theatre);

        screenRepository.save(screen);

        return mapToResponse(screen);
    }

    @Override
    public void deleteScreen(Long id) {

        Screen screen = screenRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Screen not found"));

        screenRepository.delete(screen);
    }

    private ScreenResponse mapToResponse(Screen screen) {

        return ScreenResponse.builder()
                .id(screen.getId())
                .screenNumber(screen.getScreenNumber())
                .name(screen.getName())
                .totalRows(screen.getTotalRows())
                .totalColumns(screen.getTotalColumns())
                .totalSeats(screen.getTotalSeats())
                .screenType(screen.getScreenType())
                .theatreId(screen.getTheatre().getId())
                .theatreName(screen.getTheatre().getName())
                .build();
    }
}