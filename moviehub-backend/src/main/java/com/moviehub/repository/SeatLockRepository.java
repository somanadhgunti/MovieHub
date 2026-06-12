package com.moviehub.repository;

import com.moviehub.entity.SeatLock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatLockRepository extends JpaRepository<SeatLock, Long> {
}