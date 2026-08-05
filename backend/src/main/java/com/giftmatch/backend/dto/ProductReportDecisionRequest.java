package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductReportDecisionRequest {
    @NotBlank
    private String status;

    @NotBlank
    @Size(max = 1000)
    private String resolutionNote;

    private boolean hideProduct;
}
