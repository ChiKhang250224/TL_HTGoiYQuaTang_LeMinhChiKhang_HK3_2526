package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class RecommendationResponse {
    private Long historyId;
    private String recipientName;
    private Long recipientProfileId;
    private String modelVersion;
    private List<AiRecommendationResponse.GiftPrediction> predictedGifts;
    private List<ProductRecommendation> products;

    @Data
    @Builder
    public static class ProductRecommendation {
        private Long productId;
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private String storeName;
        private String giftType;
        private String aiGiftName;
        private String predictedGiftName;
        private double matchScore;
    }
}
