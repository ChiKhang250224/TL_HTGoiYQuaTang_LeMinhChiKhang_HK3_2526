package com.giftmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocialLoginRequest {
    @NotBlank(message = "OAuth token không được để trống.")
    private String token;

    @NotBlank(message = "Nhà cung cấp đăng nhập không được để trống.")
    @Pattern(regexp = "(?i)GOOGLE|FACEBOOK", message = "Nhà cung cấp chỉ có thể là GOOGLE hoặc FACEBOOK.")
    private String provider; // "GOOGLE" hoặc "FACEBOOK"
}
