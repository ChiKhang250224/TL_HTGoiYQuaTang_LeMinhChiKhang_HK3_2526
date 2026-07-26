package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductLabelRequest {
    @NotBlank
    private String aiGiftName;

    private String status;
}
