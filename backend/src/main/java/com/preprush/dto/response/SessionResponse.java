package com.preprush.dto.response;

import com.preprush.model.Session.SessionMode;
import java.time.LocalDateTime;

public class SessionResponse {

    private Long sessionId;
    private String paperName;
    private String level;
    private SessionMode mode;
    private LocalDateTime createdAt;

    public SessionResponse() {
    }

    public SessionResponse(
        Long sessionId,
        String paperName,
        String level,
        SessionMode mode,
        LocalDateTime createdAt
    ) {
        this.sessionId = sessionId;
        this.paperName = paperName;
        this.level = level;
        this.mode = mode;
        this.createdAt = createdAt;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getPaperName() {
        return paperName;
    }

    public void setPaperName(String paperName) {
        this.paperName = paperName;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public SessionMode getMode() {
        return mode;
    }

    public void setMode(SessionMode mode) {
        this.mode = mode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
