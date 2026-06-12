package com.moviehub.controller;

import com.moviehub.dto.request.ShowRequest;
import com.moviehub.dto.response.ShowResponse;
import com.moviehub.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    @PostMapping
    public ShowResponse createShow(
            @RequestBody ShowRequest request) {

        return showService.createShow(request);
    }

    @GetMapping
    public List<ShowResponse> getAllShows() {

        return showService.getAllShows();
    }

    @GetMapping("/{id}")
    public ShowResponse getShowById(
            @PathVariable Long id) {

        return showService.getShowById(id);
    }

    @PutMapping("/{id}")
    public ShowResponse updateShow(
            @PathVariable Long id,
            @RequestBody ShowRequest request) {

        return showService.updateShow(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteShow(
            @PathVariable Long id) {

        showService.deleteShow(id);

        return "Show Deleted Successfully";
    }
}