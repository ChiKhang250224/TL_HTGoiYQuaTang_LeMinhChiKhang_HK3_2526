package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.RecommendationFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

public interface RecommendationFeedbackRepository
        extends JpaRepository<RecommendationFeedback, Long> {
    Optional<RecommendationFeedback> findByHistory_HistoryId(Long historyId);
    List<RecommendationFeedback> findBySelectedProduct_Store_UserIdAndUpdatedAtBetween(
            Long storeId, LocalDateTime from, LocalDateTime to
    );
}
