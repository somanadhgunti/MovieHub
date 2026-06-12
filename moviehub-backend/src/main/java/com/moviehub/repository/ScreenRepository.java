package com.moviehub.repository;

import com.moviehub.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreenRepository
        extends JpaRepository<Screen, Long> {
}