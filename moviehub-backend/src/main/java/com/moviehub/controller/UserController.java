package com.moviehub.controller;

import com.moviehub.entity.User;
import com.moviehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean enabled) {

        return userRepository.findById(id).map(user -> {
            user.setEnabled(enabled);
            user.setStatus(enabled ? com.moviehub.enums.UserStatus.ACTIVE : com.moviehub.enums.UserStatus.INACTIVE);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }
}
