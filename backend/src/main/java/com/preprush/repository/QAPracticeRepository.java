package com.preprush.repository;

import com.preprush.model.QAPractice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface QAPracticeRepository extends JpaRepository<QAPractice, Long> {
    List<QAPractice> findBySessionId(Long sessionId);

    long countBySession_UserId(Long userId);

    @Query("SELECT AVG(q.score) FROM QAPractice q WHERE q.session.user.id = :userId")
    Double getAverageScoreByUserId(@Param("userId") Long userId);
}
