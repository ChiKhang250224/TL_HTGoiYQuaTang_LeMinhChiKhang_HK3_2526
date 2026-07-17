package com.giftmatch.backend.service;

import com.giftmatch.backend.entity.Favorite;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.FavoriteRepository;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUser_UserId(userId);
    }

    public boolean toggleFavorite(Long userId, Long productId) {
        Optional<Favorite> existing = favoriteRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false; // means it was removed
        } else {
            User user = userRepository.findById(userId).orElseThrow();
            Product product = productRepository.findById(productId).orElseThrow();
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .product(product)
                    .build();
            favoriteRepository.save(favorite);
            return true; // means it was added
        }
    }
}
