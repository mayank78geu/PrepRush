package com.preprush.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preprush.dto.request.PrepRushGenerateRequest;
import com.preprush.dto.request.TopicDetailRequest;
import com.preprush.dto.response.PrepRushResponse;
import com.preprush.dto.response.TopicDetailResponse;
import com.preprush.model.Session;
import com.preprush.model.Topic;
import com.preprush.repository.SessionRepository;
import com.preprush.repository.TopicRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrepRushService {

    private final GeminiService geminiService;
    private final SessionRepository sessionRepository;
    private final TopicRepository topicRepository;
    private final ObjectMapper objectMapper;

    public PrepRushService(GeminiService geminiService, SessionRepository sessionRepository, TopicRepository topicRepository, ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.sessionRepository = sessionRepository;
        this.topicRepository = topicRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public PrepRushResponse generatePrepRush(PrepRushGenerateRequest request, Long userId) {
        Session session = validateSession(request.getSessionId(), userId);

        String topicsJson = geminiService.generateImportantTopics(session.getPaperName(), session.getLevel());
        
        List<String> topics;
        try {
            topics = objectMapper.readValue(topicsJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse important topics response", e);
        }

        String topicsListString = String.join(", ", topics);
        String planJson = geminiService.createRevisionPlan(session.getPaperName(), session.getLevel(), topicsListString);

        Map<String, List<String>> revisionPlan;
        try {
            revisionPlan = objectMapper.readValue(planJson, new TypeReference<Map<String, List<String>>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse revision plan response", e);
        }

        PrepRushResponse response = new PrepRushResponse();
        response.setImportantTopics(topics);
        response.setRevisionPlan(revisionPlan);

        return response;
    }

    @Transactional
    public TopicDetailResponse getTopicDetail(TopicDetailRequest request, Long userId) {
        Session session = validateSession(request.getSessionId(), userId);

        String detailJson = geminiService.getTopicDetail(session.getPaperName(), session.getLevel(), request.getTopicName());

        TopicDetailResponse response;
        try {
            response = objectMapper.readValue(detailJson, TopicDetailResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse topic detail response", e);
        }

        Topic topic = topicRepository.findBySessionIdAndTopicName(session.getId(), request.getTopicName())
            .orElse(new Topic());

        topic.setSession(session);
        topic.setTopicName(request.getTopicName());
        topic.setExplanation(response.getExplanation());
        topic.setRealWorldExample(response.getRealWorldExample());
        topic.setIdealAnswerFormat(response.getIdealAnswerFormat());
        
        topic = topicRepository.save(topic);

        response.setTopicName(request.getTopicName());
        response.setSavedTopicId(topic.getId());

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
