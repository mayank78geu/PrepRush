package com.preprush.service;

import com.preprush.dto.request.CreateSessionRequest;
import com.preprush.dto.response.SessionResponse;
import com.preprush.exception.ResourceNotFoundException;
import com.preprush.model.Session;
import com.preprush.model.User;
import com.preprush.repository.SessionRepository;
import com.preprush.repository.UserRepository;
import com.preprush.util.AuthUtil;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionService(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SessionResponse createSession(CreateSessionRequest request, Authentication authentication) {
        Long currentUserId = AuthUtil.getCurrentUserId(authentication);
        User user = userRepository.findById(currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Session session = new Session();
        session.setUser(user);
        session.setPaperName(request.getPaperName().trim());
        session.setLevel(request.getLevel().trim());
        session.setMode(request.getMode());

        Session savedSession = sessionRepository.save(session);
        return toSessionResponse(savedSession);
    }

    @Transactional(readOnly = true)
    public List<SessionResponse> getSessionsByUser(Authentication authentication) {
        Long currentUserId = AuthUtil.getCurrentUserId(authentication);
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(currentUserId)
            .stream()
            .map(this::toSessionResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public SessionResponse getSessionById(Long sessionId, Authentication authentication) {
        Long currentUserId = AuthUtil.getCurrentUserId(authentication);
        Session session = sessionRepository.findByIdAndUserId(sessionId, currentUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        return toSessionResponse(session);
    }

    private SessionResponse toSessionResponse(Session session) {
        return new SessionResponse(
            session.getId(),
            session.getPaperName(),
            session.getLevel(),
            session.getMode(),
            session.getCreatedAt()
        );
    }
}
