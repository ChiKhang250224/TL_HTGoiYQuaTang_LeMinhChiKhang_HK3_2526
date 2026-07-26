package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.Product;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductLabelItem {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String aiGiftName;
    private String giftType;
    private String status;
    private String storeName;

    public static ProductLabelItem from(Product product) {
        return ProductLabelItem.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .aiGiftName(product.getAiGiftName())
                .giftType(product.getGiftType())
                .status(product.getStatus())
                .storeName(product.getStore().getFullName())
                .build();
    }
}
