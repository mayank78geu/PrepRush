package com.preprush.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QAEvaluationRequest {
    @NotNull
    private Long sessionId;
    
    @NotBlank
    private String topicName;
    
    @NotBlank
    private String question;
    
    @NotBlank
    private String userAnswer;
}
