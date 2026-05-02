package com.preprush.dto.response;

import java.util.List;
import java.util.Map;

public class PrepRushResponse {
    private List<String> importantTopics;
    private Map<String, List<String>> revisionPlan;

    public List<String> getImportantTopics() {
        return importantTopics;
    }

    public void setImportantTopics(List<String> importantTopics) {
        this.importantTopics = importantTopics;
    }

    public Map<String, List<String>> getRevisionPlan() {
        return revisionPlan;
    }

    public void setRevisionPlan(Map<String, List<String>> revisionPlan) {
        this.revisionPlan = revisionPlan;
    }
}
