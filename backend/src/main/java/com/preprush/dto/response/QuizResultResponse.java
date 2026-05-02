package com.preprush.dto.response;

import java.util.List;

public class QuizResultResponse {
    private Integer score;
    private Integer total;
    private List<ResultDto> results;

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public List<ResultDto> getResults() {
        return results;
    }

    public void setResults(List<ResultDto> results) {
        this.results = results;
    }

    public static class ResultDto {
        private Long questionId;
        private Boolean isCorrect;

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }
    }
}
