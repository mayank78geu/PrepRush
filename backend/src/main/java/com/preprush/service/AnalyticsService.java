package com.preprush.service;

import com.preprush.dto.response.AnalyticsResponse;
import com.preprush.model.Session;
import com.preprush.repository.QAPracticeRepository;
import com.preprush.repository.QuizAttemptRepository;
import com.preprush.repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final SessionRepository sessionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QAPracticeRepository qaPracticeRepository;

    public AnalyticsService(SessionRepository sessionRepository, QuizAttemptRepository quizAttemptRepository, QAPracticeRepository qaPracticeRepository) {
        this.sessionRepository = sessionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.qaPracticeRepository = qaPracticeRepository;
    }

    public AnalyticsResponse getAnalytics(Long userId) {
        List<Session> allSessions = sessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        long totalSessions = allSessions.size();
        
        long totalQuizzes = quizAttemptRepository.countBySession_UserId(userId);
        long correctQuizzes = quizAttemptRepository.countBySession_UserIdAndIsCorrectTrue(userId);
        double quizAccuracyPercentage = totalQuizzes > 0 ? ((double) correctQuizzes / totalQuizzes) * 100 : 0.0;
        
        long totalQAPractice = qaPracticeRepository.countBySession_UserId(userId);
        Double averageQAScoreRaw = qaPracticeRepository.getAverageScoreByUserId(userId);
        double averageQAScore = averageQAScoreRaw != null ? averageQAScoreRaw : 0.0;

        List<AnalyticsResponse.SessionSummary> recentSessions = allSessions.stream()
                .limit(5)
                .map(s -> new AnalyticsResponse.SessionSummary(
                        s.getId(),
                        s.getPaperName(),
                        s.getMode().name(),
                        s.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return new AnalyticsResponse(
                totalSessions,
                totalQuizzes,
                quizAccuracyPercentage,
                totalQAPractice,
                averageQAScore,
                recentSessions
        );
    }
}
