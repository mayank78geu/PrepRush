package com.preprush.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preprush.dto.request.ImportantPointsRequest;
import com.preprush.dto.request.QuizRequest;
import com.preprush.dto.request.QuizSubmitRequest;
import com.preprush.dto.response.ImportantPointsResponse;
import com.preprush.dto.response.QuizResponse;
import com.preprush.dto.response.QuizResultResponse;
import com.preprush.model.QuizAttempt;
import com.preprush.model.Session;
import com.preprush.model.Topic;
import com.preprush.repository.QuizAttemptRepository;
import com.preprush.repository.SessionRepository;
import com.preprush.repository.TopicRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RevisionService {

    private final GeminiService geminiService;
    private final TopicRepository topicRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final SessionRepository sessionRepository;
    private final ObjectMapper objectMapper;

    public RevisionService(GeminiService geminiService, TopicRepository topicRepository, 
                           QuizAttemptRepository quizAttemptRepository, SessionRepository sessionRepository,
                           ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.topicRepository = topicRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.sessionRepository = sessionRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ImportantPointsResponse getImportantPoints(ImportantPointsRequest request, Long userId) {
        Session session = validateSession(request.getSessionId(), userId);

        String jsonResponse = geminiService.getImportantPoints(session.getPaperName(), session.getLevel(), request.getTopicName());
        
        Topic topic = topicRepository.findBySessionIdAndTopicName(session.getId(), request.getTopicName())
            .orElse(new Topic());
            
        topic.setSession(session);
        topic.setTopicName(request.getTopicName());
        topic.setImportantPoints(jsonResponse);
        topic = topicRepository.save(topic);

        ImportantPointsResponse response = new ImportantPointsResponse();
        response.setTopicName(request.getTopicName());
        response.setSavedTopicId(topic.getId());
        
        try {
            List<String> points = objectMapper.readValue(jsonResponse, new TypeReference<List<String>>() {});
            response.setImportantPoints(points);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini response");
        }

        return response;
    }

    @Transactional
    public QuizResponse generateQuiz(QuizRequest request, Long userId) {
        Session session = validateSession(request.getSessionId(), userId);
        
        String jsonResponse = geminiService.generateQuiz(
            session.getPaperName(), session.getLevel(), request.getTopicName(), request.getNumberOfQuestions()
        );

        List<QuizResponse.QuestionDto> questions;
        try {
            questions = objectMapper.readValue(jsonResponse, new TypeReference<List<QuizResponse.QuestionDto>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini response");
        }

        for (QuizResponse.QuestionDto qDto : questions) {
            QuizAttempt attempt = new QuizAttempt();
            attempt.setSession(session);
            attempt.setTopicName(request.getTopicName());
            attempt.setQuestion(qDto.getQuestion());
            try {
                attempt.setOptions(objectMapper.writeValueAsString(qDto.getOptions()));
            } catch (JsonProcessingException e) {
                attempt.setOptions("[]");
            }
            attempt.setCorrectOption(qDto.getCorrectOption());
            attempt = quizAttemptRepository.save(attempt);
            qDto.setId(attempt.getId()); // Pass back the DB ID so they can submit
        }

        QuizResponse response = new QuizResponse();
        response.setQuestions(questions);
        return response;
    }

    @Transactional
    public QuizResultResponse submitQuiz(QuizSubmitRequest request, Long userId) {
        validateSession(request.getSessionId(), userId);
        
        int score = 0;
        List<QuizResultResponse.ResultDto> results = new ArrayList<>();
        
        for (QuizSubmitRequest.AnswerDto answer : request.getAnswers()) {
            QuizAttempt attempt = quizAttemptRepository.findById(answer.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
                
            attempt.setSelectedOption(answer.getSelectedOption());
            boolean isCorrect = attempt.getCorrectOption().equals(answer.getSelectedOption());
            attempt.setIsCorrect(isCorrect);
            quizAttemptRepository.save(attempt);
            
            if (isCorrect) score++;
            
            QuizResultResponse.ResultDto resultDto = new QuizResultResponse.ResultDto();
            resultDto.setQuestionId(attempt.getId());
            resultDto.setIsCorrect(isCorrect);
            results.add(resultDto);
        }
        
        QuizResultResponse response = new QuizResultResponse();
        response.setScore(score);
        response.setTotal(request.getAnswers().size());
        response.setResults(results);
        
        return response;
    }

    private Session validateSession(Long sessionId, Long userId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        if (!session.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to session");
        }
        return session;
    }
}
