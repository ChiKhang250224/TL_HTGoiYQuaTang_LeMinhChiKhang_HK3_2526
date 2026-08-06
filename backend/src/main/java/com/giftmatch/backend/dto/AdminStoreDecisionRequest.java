package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminStoreDecisionRequest {
    @NotBlank
    @Pattern(regexp = "APPROVED|REJECTED", message = "Trạng thái phải là APPROVED hoặc REJECTED.")
    private String status;

    @Size(max = 1000)
    private String note;
}
