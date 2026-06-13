package com.moviehub.controller;

import com.moviehub.entity.Seat;
import com.moviehub.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @PostMapping("/generate/{screenId}")
    public String generateSeats(
            @PathVariable Long screenId) {

        return seatService.generateSeats(
                screenId);
    }

    @GetMapping("/screen/{screenId}")
    public List<Seat> getSeatsByScreen(
            @PathVariable Long screenId) {

        return seatService.getSeatsByScreen(
                screenId);
    }
}