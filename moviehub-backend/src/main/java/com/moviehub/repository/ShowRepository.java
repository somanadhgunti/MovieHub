package com.moviehub.repository;

import com.moviehub.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepository
        extends JpaRepository<Show, Long> {
}