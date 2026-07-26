package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.Category;
import com.giftmatch.backend.entity.Product;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String giftType;
    private String aiGiftName;
    private String status;
    private String rejectionReason;
    private Boolean isTopSelling;
    private Integer viewCount;
    private Integer recommendCount;
    private Long storeId;
    private String storeName;
    private CategorySummary category;

    public static ProductResponse from(Product product) {
        Category productCategory = product.getCategory();
        CategorySummary categorySummary = productCategory == null
                ? null
                : CategorySummary.builder()
                        .categoryId(productCategory.getCategoryId())
                        .name(productCategory.getName())
                        .build();

        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .giftType(product.getGiftType())
                .aiGiftName(product.getAiGiftName())
                .status(product.getStatus())
                .rejectionReason(product.getRejectionReason())
                .isTopSelling(product.getIsTopSelling())
                .viewCount(product.getViewCount())
                .recommendCount(product.getRecommendCount())
                .storeId(product.getStore() != null ? product.getStore().getUserId() : null)
                .storeName(product.getStore() != null ? product.getStore().getFullName() : null)
                .category(categorySummary)
                .build();
    }

    @Data
    @Builder
    public static class CategorySummary {
        private Long categoryId;
        private String name;
    }
}
