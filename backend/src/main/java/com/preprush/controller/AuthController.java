package com.preprush.controller;

import com.preprush.dto.request.LoginRequest;
import com.preprush.dto.request.RegisterRequest;
import com.preprush.dto.response.AuthResponse;
import com.preprush.service.AuthService;
import com.preprush.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserPayload> me(Authentication authentication) {
        AuthResponse.UserPayload user = authService.getCurrentUser(AuthUtil.getCurrentUserEmail(authentication));
        return ResponseEntity.ok(user);
    }

    public Long getCurrentUserId(Authentication authentication) {
        return AuthUtil.getCurrentUserId(authentication);
    }
}
