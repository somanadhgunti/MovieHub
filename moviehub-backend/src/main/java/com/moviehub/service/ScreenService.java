package com.moviehub.service;

import com.moviehub.dto.request.ScreenRequest;
import com.moviehub.dto.response.ScreenResponse;

import java.util.List;

public interface ScreenService {

    ScreenResponse createScreen(
            ScreenRequest request);

    List<ScreenResponse> getAllScreens();

    ScreenResponse getScreenById(Long id);

    ScreenResponse updateScreen(
            Long id,
            ScreenRequest request);

    void deleteScreen(Long id);
}