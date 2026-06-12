package com.moviehub.controller;

import com.moviehub.dto.request.TheatreRequest;
import com.moviehub.dto.response.TheatreResponse;
import com.moviehub.service.TheatreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@RequiredArgsConstructor
public class TheatreController {

    private final TheatreService theatreService;

    @PostMapping
    public TheatreResponse createTheatre(
            @RequestBody TheatreRequest request) {

        return theatreService.createTheatre(request);
    }

    @GetMapping
    public List<TheatreResponse> getAllTheatres() {

        return theatreService.getAllTheatres();
    }

    @GetMapping("/{id}")
    public TheatreResponse getTheatreById(
            @PathVariable Long id) {

        return theatreService.getTheatreById(id);
    }

    @PutMapping("/{id}")
    public TheatreResponse updateTheatre(
            @PathVariable Long id,
            @RequestBody TheatreRequest request) {

        return theatreService.updateTheatre(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteTheatre(
            @PathVariable Long id) {

        theatreService.deleteTheatre(id);

        return "Theatre Deleted Successfully";
    }
}