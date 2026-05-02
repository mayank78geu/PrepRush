package com.preprush.dto.request;

import java.util.List;

public class QuizSubmitRequest {
    private Long sessionId;
    private String topicName;
    private List<AnswerDto> answers;

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public List<AnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDto> answers) {
        this.answers = answers;
    }

    public static class AnswerDto {
        private Long questionId;
        private Integer selectedOption;

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public Integer getSelectedOption() {
            return selectedOption;
        }

        public void setSelectedOption(Integer selectedOption) {
            this.selectedOption = selectedOption;
        }
    }
}
