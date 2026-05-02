package com.preprush.dto.response;

public class TopicDetailResponse {
    private String topicName;
    private String explanation;
    private String realWorldExample;
    private String idealAnswerFormat;
    private Long savedTopicId;

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getRealWorldExample() {
        return realWorldExample;
    }

    public void setRealWorldExample(String realWorldExample) {
        this.realWorldExample = realWorldExample;
    }

    public String getIdealAnswerFormat() {
        return idealAnswerFormat;
    }

    public void setIdealAnswerFormat(String idealAnswerFormat) {
        this.idealAnswerFormat = idealAnswerFormat;
    }

    public Long getSavedTopicId() {
        return savedTopicId;
    }

    public void setSavedTopicId(Long savedTopicId) {
        this.savedTopicId = savedTopicId;
    }
}
