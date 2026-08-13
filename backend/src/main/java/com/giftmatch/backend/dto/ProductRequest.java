package com.giftmatch.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống.")
    @Size(max = 255, message = "Tên sản phẩm không được vượt quá 255 ký tự.")
    private String name;

    @Size(max = 5000, message = "Mô tả sản phẩm không được vượt quá 5000 ký tự.")
    private String description;

    @NotNull(message = "Giá sản phẩm là bắt buộc.")
    @DecimalMin(value = "1", message = "Giá sản phẩm phải lớn hơn 0.")
    private BigDecimal price;

    @Size(max = 1000, message = "Đường dẫn ảnh không được vượt quá 1000 ký tự.")
    private String imageUrl;

    private String giftType;

    @NotBlank(message = "Nhãn quà AI là bắt buộc.")
    @Size(max = 150, message = "Nhãn quà AI không được vượt quá 150 ký tự.")
    private String aiGiftName;

    private Long categoryId;
}
