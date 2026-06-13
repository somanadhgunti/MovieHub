package com.moviehub.service;

import com.moviehub.entity.Seat;

import java.util.List;

public interface SeatService {

    String generateSeats(Long screenId);

    List<Seat> getSeatsByScreen(Long screenId);
}