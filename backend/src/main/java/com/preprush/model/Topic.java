package com.preprush.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "topic_name", nullable = false, length = 200)
    private String topicName;

    @Column(name = "important_points", columnDefinition = "TEXT")
    private String importantPoints;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "real_world_example", columnDefinition = "TEXT")
    private String realWorldExample;

    @Column(name = "ideal_answer_format", columnDefinition = "TEXT")
    private String idealAnswerFormat;

    @Column(name = "revision_plan", columnDefinition = "TEXT")
    private String revisionPlan;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getImportantPoints() {
        return importantPoints;
    }

    public void setImportantPoints(String importantPoints) {
        this.importantPoints = importantPoints;
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

    public String getRevisionPlan() {
        return revisionPlan;
    }

    public void setRevisionPlan(String revisionPlan) {
        this.revisionPlan = revisionPlan;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
