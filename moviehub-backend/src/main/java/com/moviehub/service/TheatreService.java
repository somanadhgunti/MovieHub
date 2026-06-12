package com.moviehub.service;

import com.moviehub.dto.request.TheatreRequest;
import com.moviehub.dto.response.TheatreResponse;

import java.util.List;

public interface TheatreService {

    TheatreResponse createTheatre(
            TheatreRequest request);

    List<TheatreResponse> getAllTheatres();

    TheatreResponse getTheatreById(Long id);

    TheatreResponse updateTheatre(
            Long id,
            TheatreRequest request);

    void deleteTheatre(Long id);
}