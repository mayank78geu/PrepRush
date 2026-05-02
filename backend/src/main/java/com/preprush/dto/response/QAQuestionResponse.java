package com.preprush.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QAQuestionResponse {
    private String question;
    private String difficulty;
}
