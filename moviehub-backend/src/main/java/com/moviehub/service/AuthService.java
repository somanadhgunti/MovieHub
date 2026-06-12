package com.moviehub.service;

import com.moviehub.dto.request.LoginRequest;
import com.moviehub.dto.request.RegisterRequest;
import com.moviehub.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}