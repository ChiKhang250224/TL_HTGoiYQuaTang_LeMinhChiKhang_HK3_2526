package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminAiFeedbackResponse {
    private long totalFeedback;
    private Double averageRating;
    private Double relevantRate;
    private Double selectionRate;
    private List<ModelMetric> models;

    @Data
    @Builder
    public static class ModelMetric {
        private String modelVersion;
        private long feedbackCount;
        private Double averageRating;
        private Double relevantRate;
        private Double selectionRate;
    }
}
