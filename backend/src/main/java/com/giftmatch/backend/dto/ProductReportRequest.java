package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductReportRequest {
    @NotBlank
    @Size(max = 50)
    private String reason;

    @Size(max = 1000)
    private String description;
}
