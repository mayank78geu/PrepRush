package com.preprush.dto.response;

import java.util.List;

public class ImportantPointsResponse {
    private String topicName;
    private List<String> importantPoints;
    private Long savedTopicId;

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public List<String> getImportantPoints() {
        return importantPoints;
    }

    public void setImportantPoints(List<String> importantPoints) {
        this.importantPoints = importantPoints;
    }

    public Long getSavedTopicId() {
        return savedTopicId;
    }

    public void setSavedTopicId(Long savedTopicId) {
        this.savedTopicId = savedTopicId;
    }
}
