package com.moviehub.service.impl;

import com.moviehub.entity.Screen;
import com.moviehub.entity.Seat;
import com.moviehub.enums.SeatType;
import com.moviehub.exception.ResourceAlreadyExistsException;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.ScreenRepository;
import com.moviehub.repository.SeatRepository;
import com.moviehub.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final ScreenRepository screenRepository;

    @Override
    public String generateSeats(Long screenId) {

        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Screen not found"));

        if (seatRepository.existsByScreenId(screenId)) {
            throw new ResourceAlreadyExistsException(
                    "Seats already generated for this screen");
        }

        List<Seat> seats = new ArrayList<>();

        for (int row = 0; row < screen.getTotalRows(); row++) {

            String rowName =
                    String.valueOf((char) ('A' + row));

            for (int col = 1;
                 col <= screen.getTotalColumns();
                 col++) {

                Seat seat = Seat.builder()
                        .rowNumber(rowName)
                        .seatNumber(col)
                        .seatType(SeatType.STANDARD)
                        .screen(screen)
                        .build();

                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);

        return seats.size() +
                " seats generated successfully";
    }

    @Override
    public List<Seat> getSeatsByScreen(
            Long screenId) {

        return seatRepository.findByScreenId(
                screenId);
    }
}