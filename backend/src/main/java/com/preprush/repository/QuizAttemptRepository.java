package com.preprush.repository;

import com.preprush.model.QuizAttempt;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findBySessionIdAndTopicName(Long sessionId, String topicName);

    long countBySession_UserId(Long userId);
    long countBySession_UserIdAndIsCorrectTrue(Long userId);
}
