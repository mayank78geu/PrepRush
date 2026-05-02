package com.preprush.repository;

import com.preprush.model.Session;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Session> findByIdAndUserId(Long sessionId, Long userId);
}
