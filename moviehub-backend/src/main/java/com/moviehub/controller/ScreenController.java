package com.moviehub.controller;

import com.moviehub.dto.request.ScreenRequest;
import com.moviehub.dto.response.ScreenResponse;
import com.moviehub.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screens")
@RequiredArgsConstructor
public class ScreenController {

    private final ScreenService screenService;

    @PostMapping
    public ScreenResponse createScreen(
            @RequestBody ScreenRequest request) {

        return screenService.createScreen(request);
    }

    @GetMapping
    public List<ScreenResponse> getAllScreens() {

        return screenService.getAllScreens();
    }

    @GetMapping("/{id}")
    public ScreenResponse getScreenById(
            @PathVariable Long id) {

        return screenService.getScreenById(id);
    }

    @PutMapping("/{id}")
    public ScreenResponse updateScreen(
            @PathVariable Long id,
            @RequestBody ScreenRequest request) {

        return screenService.updateScreen(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteScreen(
            @PathVariable Long id) {

        screenService.deleteScreen(id);

        return "Screen Deleted Successfully";
    }
}