package com.preprush.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QAEvaluationResponse {
    private int score;
    private String feedback;
    private String idealAnswer;
}
