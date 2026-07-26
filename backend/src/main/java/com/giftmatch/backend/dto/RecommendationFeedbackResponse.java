package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RecommendationFeedbackResponse {
    private Long feedbackId;
    private Long historyId;
    private Integer rating;
    private Boolean relevant;
    private Long selectedProductId;
    private String comment;
    private LocalDateTime updatedAt;
}
