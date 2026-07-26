package com.giftmatch.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RecommendationFeedbackRequest {
    @Min(1)
    @Max(5)
    private int rating;

    private Boolean relevant;

    private Long selectedProductId;

    @Size(max = 1000)
    private String comment;
}
