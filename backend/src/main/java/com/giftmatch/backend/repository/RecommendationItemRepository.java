package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.RecommendationItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RecommendationItemRepository extends JpaRepository<RecommendationItem, Long> {
    @EntityGraph(attributePaths = {"product", "history"})
    List<RecommendationItem> findByProduct_Store_UserIdAndHistory_CreatedAtBetween(
            Long storeId, LocalDateTime from, LocalDateTime to
    );
}
