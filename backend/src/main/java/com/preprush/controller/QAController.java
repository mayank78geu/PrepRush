package com.preprush.controller;

import com.preprush.dto.request.QAEvaluationRequest;
import com.preprush.dto.request.QAQuestionRequest;
import com.preprush.dto.response.QAEvaluationResponse;
import com.preprush.dto.response.QAQuestionResponse;
import com.preprush.service.QAService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qa")
public class QAController {

    private final QAService qaService;

    public QAController(QAService qaService) {
        this.qaService = qaService;
    }

    @PostMapping("/question")
    public ResponseEntity<QAQuestionResponse> getQuestion(
            @Valid @RequestBody QAQuestionRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(qaService.generateQuestion(request, userEmail));
    }

    @PostMapping("/evaluate")
    public ResponseEntity<QAEvaluationResponse> evaluateAnswer(
            @Valid @RequestBody QAEvaluationRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(qaService.evaluateAnswer(request, userEmail));
    }
}
