package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaxonomyLabelRequest {
    @NotNull
    private Long giftTypeId;
    @NotBlank @Size(max = 100)
    private String code;
    @NotBlank @Size(max = 120)
    private String displayName;
}
