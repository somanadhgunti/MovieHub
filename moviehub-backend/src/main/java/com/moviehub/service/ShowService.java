package com.moviehub.service;

import com.moviehub.dto.request.ShowRequest;
import com.moviehub.dto.response.ShowResponse;

import java.util.List;

public interface ShowService {

    ShowResponse createShow(
            ShowRequest request);

    List<ShowResponse> getAllShows();

    ShowResponse getShowById(Long id);

    ShowResponse updateShow(
            Long id,
            ShowRequest request);

    void deleteShow(Long id);
}