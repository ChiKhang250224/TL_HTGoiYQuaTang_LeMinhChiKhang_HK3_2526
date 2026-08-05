package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRejectionRequest {
    @NotBlank(message = "Ly do tu choi khong duoc de trong.")
    @Size(max = 1000, message = "Ly do tu choi khong duoc vuot qua 1000 ky tu.")
    private String reason;
}
