package com.preprush.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QAQuestionRequest {
    @NotNull
    private Long sessionId;
    
    @NotBlank
    private String topicName;
    
    private String difficulty = "medium"; // e.g. easy, medium, hard
}
