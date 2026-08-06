package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DataQualityResponse {
    private long productsMissingImage;
    private long productsMissingDescription;
    private long productsMissingGiftLabel;
    private long productsWithInvalidPrice;
    private long unmappedPredictionLabels;
    private List<ProductIssue> productIssues;
    private List<String> unmappedLabels;

    @Data
    @Builder
    public static class ProductIssue {
        private Long productId;
        private String name;
        private List<String> issues;
    }
}
