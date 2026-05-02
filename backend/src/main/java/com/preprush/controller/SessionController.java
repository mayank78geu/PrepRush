package com.preprush.controller;

import com.preprush.dto.request.CreateSessionRequest;
import com.preprush.dto.response.SessionResponse;
import com.preprush.service.SessionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
        @Valid @RequestBody CreateSessionRequest request,
        Authentication authentication
    ) {
        SessionResponse response = sessionService.createSession(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SessionResponse>> getSessions(Authentication authentication) {
        List<SessionResponse> sessions = sessionService.getSessionsByUser(authentication);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionResponse> getSessionById(
        @PathVariable Long sessionId,
        Authentication authentication
    ) {
        SessionResponse session = sessionService.getSessionById(sessionId, authentication);
        return ResponseEntity.ok(session);
    }
}
