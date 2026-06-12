package com.moviehub.service.impl;

import com.moviehub.dto.request.TheatreRequest;
import com.moviehub.dto.response.TheatreResponse;
import com.moviehub.entity.Theatre;
import com.moviehub.enums.TheatreStatus;
import com.moviehub.exception.ResourceAlreadyExistsException;
import com.moviehub.exception.ResourceNotFoundException;
import com.moviehub.repository.TheatreRepository;
import com.moviehub.service.TheatreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheatreServiceImpl implements TheatreService {

    private final TheatreRepository theatreRepository;

    @Override
    public TheatreResponse createTheatre(
            TheatreRequest request) {

        if (theatreRepository.existsByName(
                request.getName())) {

            throw new ResourceAlreadyExistsException(
                    "Theatre already exists");
        }

        Theatre theatre = Theatre.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .totalScreens(request.getTotalScreens())
                .amenities(request.getAmenities())
                .status(TheatreStatus.ACTIVE)
                .build();

        theatreRepository.save(theatre);

        return mapToResponse(theatre);
    }

    @Override
    public List<TheatreResponse> getAllTheatres() {

        return theatreRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TheatreResponse getTheatreById(Long id) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Theatre not found"));

        return mapToResponse(theatre);
    }

    @Override
    public TheatreResponse updateTheatre(
            Long id,
            TheatreRequest request) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Theatre not found"));

        theatre.setName(request.getName());
        theatre.setAddress(request.getAddress());
        theatre.setCity(request.getCity());
        theatre.setState(request.getState());
        theatre.setZipCode(request.getZipCode());
        theatre.setPhoneNumber(request.getPhoneNumber());
        theatre.setEmail(request.getEmail());
        theatre.setTotalScreens(request.getTotalScreens());
        theatre.setAmenities(request.getAmenities());

        theatreRepository.save(theatre);

        return mapToResponse(theatre);
    }

    @Override
    public void deleteTheatre(Long id) {

        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Theatre not found"));

        theatreRepository.delete(theatre);
    }

    private TheatreResponse mapToResponse(
            Theatre theatre) {

        return TheatreResponse.builder()
                .id(theatre.getId())
                .name(theatre.getName())
                .address(theatre.getAddress())
                .city(theatre.getCity())
                .state(theatre.getState())
                .zipCode(theatre.getZipCode())
                .phoneNumber(theatre.getPhoneNumber())
                .email(theatre.getEmail())
                .totalScreens(theatre.getTotalScreens())
                .amenities(theatre.getAmenities())
                .status(theatre.getStatus())
                .build();
    }
}