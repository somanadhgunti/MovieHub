package com.moviehub.repository;

import com.moviehub.entity.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheatreRepository
        extends JpaRepository<Theatre, Long> {

    boolean existsByName(String name);
}