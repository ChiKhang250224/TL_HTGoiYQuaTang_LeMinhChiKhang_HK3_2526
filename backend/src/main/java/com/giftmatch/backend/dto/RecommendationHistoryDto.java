package com.giftmatch.backend.dto;

import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;

@Data
public class RecommendationHistoryDto {
    private Long historyId;
    private Long userId;
    private Long profileId;
    private String aiInsights;
    private List<Long> recommendedProductIds;
    private LocalDateTime createdAt;
}
