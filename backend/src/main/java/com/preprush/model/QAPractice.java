package com.preprush.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "qa_practices")
@Getter
@Setter
public class QAPractice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;
    
    @Column(nullable = false)
    private String topicName;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;
    
    @Column(columnDefinition = "TEXT")
    private String userAnswer;
    
    @Column(columnDefinition = "TEXT")
    private String idealAnswer;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private Integer score;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
