package com.preprush.controller;

import com.preprush.dto.request.ImportantPointsRequest;
import com.preprush.dto.request.QuizRequest;
import com.preprush.dto.request.QuizSubmitRequest;
import com.preprush.dto.response.ImportantPointsResponse;
import com.preprush.dto.response.QuizResponse;
import com.preprush.dto.response.QuizResultResponse;
import com.preprush.service.RevisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.preprush.model.User;

@RestController
@RequestMapping("/api/revision")
public class RevisionController {

    private final RevisionService revisionService;

    public RevisionController(RevisionService revisionService) {
        this.revisionService = revisionService;
    }

    @PostMapping("/important-points")
    public ResponseEntity<ImportantPointsResponse> getImportantPoints(
            @RequestBody ImportantPointsRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(revisionService.getImportantPoints(request, user.getId()));
    }

    @PostMapping("/quiz")
    public ResponseEntity<QuizResponse> generateQuiz(
            @RequestBody QuizRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(revisionService.generateQuiz(request, user.getId()));
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @RequestBody QuizSubmitRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(revisionService.submitQuiz(request, user.getId()));
    }
}
