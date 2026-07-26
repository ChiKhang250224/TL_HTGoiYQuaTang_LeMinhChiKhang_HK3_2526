package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.RecommendationFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecommendationFeedbackRepository
        extends JpaRepository<RecommendationFeedback, Long> {
    Optional<RecommendationFeedback> findByHistory_HistoryId(Long historyId);
}
