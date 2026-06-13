package com.moviehub.service;

import com.moviehub.entity.ShowSeat;

import java.util.List;

public interface ShowSeatService {

    String generateShowSeats(Long showId);

    List<ShowSeat> getShowSeats(Long showId);
}