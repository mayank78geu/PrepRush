package com.preprush.dto.request;

import com.preprush.model.Session.SessionMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateSessionRequest {

    @NotBlank
    @Size(max = 200)
    private String paperName;

    @NotBlank
    @Size(max = 50)
    private String level;

    @NotNull
    private SessionMode mode;

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
}
