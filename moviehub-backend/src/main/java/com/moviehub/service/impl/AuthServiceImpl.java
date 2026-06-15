package com.moviehub.service.impl;

import com.moviehub.dto.request.LoginRequest;
import com.moviehub.dto.request.RegisterRequest;
import com.moviehub.dto.response.AuthResponse;
import com.moviehub.entity.User;
import com.moviehub.enums.Role;
import com.moviehub.enums.UserStatus;
import com.moviehub.exception.InvalidCredentialsException;
import com.moviehub.exception.ResourceAlreadyExistsException;
import com.moviehub.repository.UserRepository;
import com.moviehub.security.JwtTokenProvider;
import com.moviehub.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException(
                    "Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(Role.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .enabled(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .message("User Registered Successfully")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid username or password"));

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword());

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "Invalid username or password");
        }

        String token =
                jwtTokenProvider.generateToken(
                        user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .message("Login Successful")
                .build();
    }
}