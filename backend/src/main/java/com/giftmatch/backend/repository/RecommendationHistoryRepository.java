package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.RecommendationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationHistoryRepository extends JpaRepository<RecommendationHistory, Long> {
    List<RecommendationHistory> findByUser_UserIdOrderByCreatedAtDesc(Long userId);

    Optional<RecommendationHistory> findByHistoryIdAndUser_UserId(
            Long historyId, Long userId
    );
}
