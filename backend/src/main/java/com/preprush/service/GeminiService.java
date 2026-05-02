package com.preprush.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preprush.dto.response.QAQuestionResponse;
import com.preprush.dto.response.QAEvaluationResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt) {
        return generateContentWithRetry(prompt, 1);
    }

    private String generateContentWithRetry(String prompt, int retriesLeft) {
        try {
            String url = apiUrl + "?key=" + apiKey;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contents = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            
            parts.put("text", prompt);
            contents.put("parts", List.of(parts));
            requestBody.put("contents", List.of(contents));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            
            // Extract text from Gemini response structure
            String responseBody = response.getBody();
            var jsonNode = objectMapper.readTree(responseBody);
            String text = jsonNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean up markdown block if present
            text = text.trim();
            if (text.startsWith("```json")) {
                text = text.substring(7);
            } else if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
            
            // Validate it's parseable JSON
            objectMapper.readTree(text.trim());
            return text.trim();
        } catch (Exception e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("429 Too Many Requests")) {
                throw new RuntimeException("API Rate Limit Exceeded: The free tier allows only 5 requests per minute. Please wait 30-60 seconds and try again.");
            }
            if (retriesLeft > 0) {
                try {
                    Thread.sleep(2000); // Sleep 2s before simple retries
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                return generateContentWithRetry(prompt, retriesLeft - 1);
            }
            throw new RuntimeException("AI service temporarily unavailable: " + errorMsg, e);
        }
    }

    public String getImportantPoints(String paperName, String level, String topicName) {
        String prompt = String.format(
            "You are an expert academic tutor. Given the subject \"%s\" at \"%s\" level and the topic \"%s\", provide exactly 8-10 most important points a student must remember for their exam.\n\n" +
            "Return ONLY a valid JSON array of strings. No extra text, no markdown, no explanation. Example format:\n" +
            "[\"Point 1 here\", \"Point 2 here\", \"Point 3 here\"]",
            paperName, level, topicName
        );
        return generateContent(prompt);
    }

    public String generateQuiz(String paperName, String level, String topicName, int numberOfQuestions) {
        String prompt = String.format(
            "You are an exam question setter for \"%s\" at \"%s\" level. Generate exactly %d multiple choice questions on the topic \"%s\".\n\n" +
            "Return ONLY a valid JSON array. No extra text, no markdown. Format:\n" +
            "[\n" +
            "  {\n" +
            "    \"question\": \"Question text here?\",\n" +
            "    \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
            "    \"correctOption\": 0\n" +
            "  }\n" +
            "]\n" +
            "correctOption is 0-indexed (0 = first option).",
            paperName, level, numberOfQuestions, topicName
        );
        return generateContent(prompt);
    }

    public String generateImportantTopics(String paperName, String level) {
        String prompt = String.format(
            "You are an exam strategy expert for \"%s\" at \"%s\" level. List the 8-10 most important topics a student should focus on in the last 24 hours before their exam.\n\n" +
            "Return ONLY a valid JSON array of topic name strings. No extra text, no markdown.\n" +
            "Example: [\"Topic 1\", \"Topic 2\", \"Topic 3\"]",
            paperName, level
        );
        return generateContent(prompt);
    }

    public String createRevisionPlan(String paperName, String level, String topicsList) {
        String prompt = String.format(
            "You are an exam coach for a student appearing in \"%s\" at \"%s\" level. Create a revision plan for these topics: %s.\n\n" +
            "Return ONLY a valid JSON object with time slots as keys and arrays of topic names as values. No extra text, no markdown.\n" +
            "Example: { \"morning\": [\"Topic A\", \"Topic B\"], \"afternoon\": [\"Topic C\"], \"evening\": [\"Quick revision of all\"] }",
            paperName, level, topicsList
        );
        return generateContent(prompt);
    }

    public String getTopicDetail(String paperName, String level, String topicName) {
        String prompt = String.format(
            "You are an expert tutor for \"%s\" at \"%s\" level. For the topic \"%s\", provide:\n" +
            "1. A short, clear explanation (2-3 sentences)\n" +
            "2. One real-world example a student can easily relate to\n" +
            "3. The ideal answer format/structure to use in an exam to score full marks\n\n" +
            "Return ONLY a valid JSON object. No extra text, no markdown. Format:\n" +
            "{\n" +
            "  \"explanation\": \"...\",\n" +
            "  \"realWorldExample\": \"...\",\n" +
            "  \"idealAnswerFormat\": \"...\"\n" +
            "}",
            paperName, level, topicName
        );
        return generateContent(prompt);
    }
    // Step 7: Q&A Practice

    public QAQuestionResponse generateQAQuestion(String topicName, String difficulty) {
        String prompt = "Generate a single interview or exam question about the topic: " + topicName + ".\n" +
                "The difficulty should be: " + difficulty + ".\n" +
                "Respond ONLY with a JSON object in this format:\n" +
                "{\n" +
                "  \"question\": \"<the question text>\",\n" +
                "  \"difficulty\": \"<easy/medium/hard>\"\n" +
                "}";

        String jsonResponse = generateContent(prompt);
        try {
            return objectMapper.readValue(jsonResponse, QAQuestionResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse QAQuestionResponse JSON: " + e.getMessage(), e);
        }
    }

    public QAEvaluationResponse evaluateQAAnswer(String topicName, String question, String userAnswer) {
        String prompt = "You are an expert examiner. Evaluate the following user answer to a question about " + topicName + ".\n" +
                "Question: " + question + "\n" +
                "User Answer: " + userAnswer + "\n\n" +
                "Provide an honest score out of 10. Give constructive feedback on what's missing or wrong, and provide the ideal answer.\n" +
                "Respond ONLY with a JSON object in this format:\n" +
                "{\n" +
                "  \"score\": <integer from 0 to 10>,\n" +
                "  \"feedback\": \"<your feedback>\",\n" +
                "  \"idealAnswer\": \"<the ideal answer>\"\n" +
                "}";

        String jsonResponse = generateContent(prompt);
        try {
            return objectMapper.readValue(jsonResponse, QAEvaluationResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse QAEvaluationResponse JSON: " + e.getMessage(), e);
        }
    }
}
