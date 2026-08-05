package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserProfileRequest {
    @NotBlank @Size(max = 100)
    private String fullName;
    @Size(max = 20)
    private String phoneNumber;
    @Size(max = 500)
    private String avatarUrl;
}
