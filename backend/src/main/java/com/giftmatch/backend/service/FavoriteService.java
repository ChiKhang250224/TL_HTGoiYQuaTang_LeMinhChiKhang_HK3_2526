package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.FavoriteDto;
import com.giftmatch.backend.entity.Favorite;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.FavoriteRepository;
import com.giftmatch.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<FavoriteDto> getUserFavorites(User user) {
        return favoriteRepository.findByUser_UserId(user.getUserId())
                .stream()
                .map(FavoriteDto::from)
                .toList();
    }

    @Transactional
    public FavoriteDto addFavorite(User user, Long productId) {
        return favoriteRepository
                .findByUser_UserIdAndProduct_ProductId(user.getUserId(), productId)
                .map(FavoriteDto::from)
                .orElseGet(() -> createFavorite(user, productId));
    }

    @Transactional
    public void removeFavorite(User user, Long productId) {
        favoriteRepository
                .findByUser_UserIdAndProduct_ProductId(user.getUserId(), productId)
                .ifPresent(favoriteRepository::delete);
    }

    private FavoriteDto createFavorite(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay san pham."
                ));
        if (!"APPROVED".equals(product.getStatus()) || !"IN_STOCK".equals(product.getBusinessStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Chỉ có thể lưu sản phẩm đã được phê duyệt và còn kinh doanh."
            );
        }
        Favorite favorite = Favorite.builder()
                .user(user)
                .product(product)
                .build();
        return FavoriteDto.from(favoriteRepository.save(favorite));
    }
}
