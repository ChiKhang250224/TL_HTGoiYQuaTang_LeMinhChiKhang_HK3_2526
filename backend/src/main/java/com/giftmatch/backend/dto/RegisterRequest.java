package com.giftmatch.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Họ tên không được để trống.")
    @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự.")
    private String fullName;

    @NotBlank(message = "Email không được để trống.")
    @Email(message = "Email không đúng định dạng.")
    @Size(max = 190, message = "Email không được vượt quá 190 ký tự.")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống.")
    @Size(min = 8, max = 72, message = "Mật khẩu phải có từ 8 đến 72 ký tự.")
    private String password;

    @NotBlank(message = "Số điện thoại không được để trống.")
    @Pattern(regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại Việt Nam không đúng định dạng.")
    private String phoneNumber;

    @Pattern(regexp = "(?i)CUSTOMER|STORE", message = "Vai trò đăng ký chỉ có thể là CUSTOMER hoặc STORE.")
    private String role; // CUSTOMER, STORE
}
