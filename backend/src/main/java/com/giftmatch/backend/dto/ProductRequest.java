package com.giftmatch.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String giftType;
    private String aiGiftName;
    private Long categoryId;
}
