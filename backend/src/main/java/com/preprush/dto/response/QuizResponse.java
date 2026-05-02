package com.preprush.dto.response;

import java.util.List;

public class QuizResponse {
    private List<QuestionDto> questions;

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }

    public static class QuestionDto {
        private Long id;
        private String question;
        private List<String> options;
        private Integer correctOption;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public Integer getCorrectOption() {
            return correctOption;
        }

        public void setCorrectOption(Integer correctOption) {
            this.correctOption = correctOption;
        }
    }
}
