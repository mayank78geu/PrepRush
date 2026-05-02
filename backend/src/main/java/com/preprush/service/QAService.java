package com.preprush.service;

import com.preprush.dto.request.QAEvaluationRequest;
import com.preprush.dto.request.QAQuestionRequest;
import com.preprush.dto.response.QAEvaluationResponse;
import com.preprush.dto.response.QAQuestionResponse;
import com.preprush.exception.UnauthorizedException;
import com.preprush.model.QAPractice;
import com.preprush.model.Session;
import com.preprush.repository.QAPracticeRepository;
import com.preprush.repository.SessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QAService {

    private final SessionRepository sessionRepository;
    private final QAPracticeRepository qaPracticeRepository;
    private final GeminiService geminiService;

    public QAService(SessionRepository sessionRepository,
                     QAPracticeRepository qaPracticeRepository,
                     GeminiService geminiService) {
        this.sessionRepository = sessionRepository;
        this.qaPracticeRepository = qaPracticeRepository;
        this.geminiService = geminiService;
    }

    public QAQuestionResponse generateQuestion(QAQuestionRequest request, String userEmail) {
        // Validate session
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("Session does not belong to the user");
        }

        return geminiService.generateQAQuestion(request.getTopicName(), request.getDifficulty());
    }

    @Transactional
    public QAEvaluationResponse evaluateAnswer(QAEvaluationRequest request, String userEmail) {
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("Session does not belong to the user");
        }

        // Call Gemini to evaluate
        QAEvaluationResponse evaluation = geminiService.evaluateQAAnswer(
                request.getTopicName(), request.getQuestion(), request.getUserAnswer());

        // Save to DB
        QAPractice practice = new QAPractice();
        practice.setSession(session);
        practice.setTopicName(request.getTopicName());
        practice.setQuestion(request.getQuestion());
        practice.setUserAnswer(request.getUserAnswer());
        practice.setScore(evaluation.getScore());
        practice.setFeedback(evaluation.getFeedback());
        practice.setIdealAnswer(evaluation.getIdealAnswer());
        
        qaPracticeRepository.save(practice);

        return evaluation;
    }
}
