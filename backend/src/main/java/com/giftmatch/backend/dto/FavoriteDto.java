package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.Favorite;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FavoriteDto {
    private Long favoriteId;
    private LocalDateTime createdAt;
    private ProductResponse product;

    public static FavoriteDto from(Favorite favorite) {
        return FavoriteDto.builder()
                .favoriteId(favorite.getFavoriteId())
                .createdAt(favorite.getCreatedAt())
                .product(ProductResponse.from(favorite.getProduct()))
                .build();
    }
}
