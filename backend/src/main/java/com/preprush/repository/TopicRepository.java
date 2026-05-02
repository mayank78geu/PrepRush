package com.preprush.repository;

import com.preprush.model.Topic;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findBySessionIdAndTopicName(Long sessionId, String topicName);
}
