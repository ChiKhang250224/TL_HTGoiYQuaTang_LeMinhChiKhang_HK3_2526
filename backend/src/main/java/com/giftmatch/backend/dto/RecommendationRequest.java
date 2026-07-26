package com.giftmatch.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RecommendationRequest {
    private String recipientName;
    private Long recipientProfileId;

    @NotBlank
    private String relationship;

    @NotBlank
    private String occasion;

    @NotBlank
    private String ageGroup;

    @NotBlank
    private String gender;

    @NotBlank
    private String hobby;

    @NotBlank
    private String personality;

    @NotNull
    @Positive
    private BigDecimal budget;

    @NotBlank
    private String style;

    @NotBlank
    private String relationshipCloseness;

    @Min(1)
    @Max(20)
    private int topK = 5;
}
