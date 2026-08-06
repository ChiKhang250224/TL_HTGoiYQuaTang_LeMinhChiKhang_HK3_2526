package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser_UserId(Long userId);
    Optional<Favorite> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);
    List<Favorite> findByProduct_Store_UserIdAndCreatedAtBetween(
            Long storeId, LocalDateTime from, LocalDateTime to
    );
}
