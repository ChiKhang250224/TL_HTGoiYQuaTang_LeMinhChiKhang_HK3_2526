package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaxonomyTypeRequest {
    @NotBlank @Size(max = 60)
    private String code;
    @NotBlank @Size(max = 100)
    private String displayName;
}
