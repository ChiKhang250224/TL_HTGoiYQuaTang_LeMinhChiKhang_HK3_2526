package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class HistoryResponse {
    private Long historyId;
    private LocalDateTime createdAt;
    private String aiInsights;
    private String modelVersion;
    private String occasion;
    private BigDecimal budget;
    private String interests;
    private String relationshipToReceiver;
    private String recipientName;
    private Recipient recipient;
    private List<ProductItem> products;

    @Data
    @Builder
    public static class Recipient {
        private Long profileId;
        private String fullName;
        private Integer age;
        private String relationship;
    }

    @Data
    @Builder
    public static class ProductItem {
        private Long productId;
        private String name;
        private BigDecimal price;
        private String imageUrl;
        private String giftType;
        private String aiGiftName;
        private String storeName;
        private String predictedGiftName;
        private String predictedGiftType;
        private BigDecimal aiScore;
        private BigDecimal matchScore;
        private Integer rankPosition;
    }
}
