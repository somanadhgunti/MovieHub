package com.moviehub.controller;

import com.moviehub.entity.ShowSeat;
import com.moviehub.service.ShowSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/show-seats")
@RequiredArgsConstructor
public class ShowSeatController {

    private final ShowSeatService showSeatService;

    @PostMapping("/generate/{showId}")
    public String generateShowSeats(
            @PathVariable Long showId) {

        return showSeatService.generateShowSeats(
                showId);
    }

    @GetMapping("/{showId}")
    public List<ShowSeat> getShowSeats(
            @PathVariable Long showId) {

        return showSeatService.getShowSeats(
                showId);
    }
}