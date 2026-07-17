package com.giftmatch.backend.dto;

import lombok.Data;

@Data
public class FavoriteDto {
    private Long favoriteId;
    private Long userId;
    private Long productId;
}
