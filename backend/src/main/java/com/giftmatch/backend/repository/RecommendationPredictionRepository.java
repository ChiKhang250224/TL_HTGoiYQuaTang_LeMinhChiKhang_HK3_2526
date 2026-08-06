package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.RecommendationPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecommendationPredictionRepository extends JpaRepository<RecommendationPrediction, Long> {
    @Query("select distinct p.giftName from RecommendationPrediction p where p.giftName is not null")
    List<String> findDistinctGiftNames();
}
