package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductBusinessStatusRequest {
    @NotBlank
    private String businessStatus;
}
