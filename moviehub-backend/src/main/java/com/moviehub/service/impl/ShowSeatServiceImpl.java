package com.moviehub.service.impl;

import com.moviehub.entity.Seat;
import com.moviehub.entity.Show;
import com.moviehub.entity.ShowSeat;
import com.moviehub.enums.SeatStatus;
import com.moviehub.exception.ResourceAlreadyExistsException;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.SeatRepository;
import com.moviehub.repository.ShowRepository;
import com.moviehub.repository.ShowSeatRepository;
import com.moviehub.service.ShowSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowSeatServiceImpl implements ShowSeatService {

    private final ShowSeatRepository showSeatRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    @Override
    public String generateShowSeats(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Show not found"));

        if (showSeatRepository.existsByShowId(showId)) {
            throw new ResourceAlreadyExistsException(
                    "Show seats already generated");
        }

        List<Seat> seats =
                seatRepository.findByScreenId(
                        show.getScreen().getId());

        List<ShowSeat> showSeats =
                new ArrayList<>();

        for (Seat seat : seats) {

            ShowSeat showSeat = ShowSeat.builder()
                    .show(show)
                    .seat(seat)
                    .status(SeatStatus.AVAILABLE)
                    .price(show.getBasePrice())
                    .build();

            showSeats.add(showSeat);
        }

        showSeatRepository.saveAll(showSeats);

        return showSeats.size() +
                " show seats generated successfully";
    }

    @Override
    public List<ShowSeat> getShowSeats(Long showId) {

        return showSeatRepository.findByShowId(showId);
    }
}