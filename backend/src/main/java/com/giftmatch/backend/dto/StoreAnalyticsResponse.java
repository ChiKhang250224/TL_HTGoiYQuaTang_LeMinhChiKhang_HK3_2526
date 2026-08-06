package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class StoreAnalyticsResponse {
    private LocalDate from;
    private LocalDate to;
    private long totalProducts;
    private long totalAppearances;
    private long totalViews;
    private long totalFavorites;
    private long totalSelections;
    private Double averageRating;
    private List<ProductMetric> products;

    @Data
    @Builder
    public static class ProductMetric {
        private Long productId;
        private String name;
        private String imageUrl;
        private String status;
        private String businessStatus;
        private long appearances;
        private long views;
        private long favorites;
        private long selections;
        private Double averageRating;
    }
}
