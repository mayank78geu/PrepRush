package com.preprush.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class AnalyticsResponse {

    private long totalSessions;
    private long totalQuizzes;
    private double quizAccuracyPercentage;
    private long totalQAPractice;
    private double averageQAScore;
    private List<SessionSummary> recentSessions;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(long totalSessions, long totalQuizzes, double quizAccuracyPercentage, long totalQAPractice, double averageQAScore, List<SessionSummary> recentSessions) {
        this.totalSessions = totalSessions;
        this.totalQuizzes = totalQuizzes;
        this.quizAccuracyPercentage = quizAccuracyPercentage;
        this.totalQAPractice = totalQAPractice;
        this.averageQAScore = averageQAScore;
        this.recentSessions = recentSessions;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public long getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(long totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public double getQuizAccuracyPercentage() {
        return quizAccuracyPercentage;
    }

    public void setQuizAccuracyPercentage(double quizAccuracyPercentage) {
        this.quizAccuracyPercentage = quizAccuracyPercentage;
    }

    public long getTotalQAPractice() {
        return totalQAPractice;
    }

    public void setTotalQAPractice(long totalQAPractice) {
        this.totalQAPractice = totalQAPractice;
    }

    public double getAverageQAScore() {
        return averageQAScore;
    }

    public void setAverageQAScore(double averageQAScore) {
        this.averageQAScore = averageQAScore;
    }

    public List<SessionSummary> getRecentSessions() {
        return recentSessions;
    }

    public void setRecentSessions(List<SessionSummary> recentSessions) {
        this.recentSessions = recentSessions;
    }

    public static class SessionSummary {
        private Long id;
        private String paperName;
        private String mode;
        private LocalDateTime createdAt;

        public SessionSummary() {
        }

        public SessionSummary(Long id, String paperName, String mode, LocalDateTime createdAt) {
            this.id = id;
            this.paperName = paperName;
            this.mode = mode;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getPaperName() {
            return paperName;
        }

        public void setPaperName(String paperName) {
            this.paperName = paperName;
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
