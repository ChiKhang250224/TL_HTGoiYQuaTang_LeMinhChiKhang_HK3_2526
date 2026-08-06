package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaxonomyStatusRequest {
    @NotNull
    private Boolean active;
}
