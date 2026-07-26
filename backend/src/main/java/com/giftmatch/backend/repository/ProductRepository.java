package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStore_UserId(Long storeId);
    List<Product> findByStatus(String status);
    List<Product> findByStatusAndPriceLessThanEqualOrderByRecommendCountDesc(
            String status, BigDecimal maxPrice
    );
    List<Product> findByAiGiftNameIsNullOrAiGiftName(String aiGiftName);

    @org.springframework.data.jpa.repository.Query("""
            SELECT p
            FROM Product p
            WHERE p.status = 'APPROVED'
            ORDER BY
                CASE WHEN p.isTopSelling = true THEN 0 ELSE 1 END,
                COALESCE(p.recommendCount, 0) DESC,
                COALESCE(p.viewCount, 0) DESC,
                p.createdAt DESC
            """)
    List<Product> findFeaturedProducts(Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' AND " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.categoryId = :categoryId) AND " +
            "(:giftType IS NULL OR p.giftType = :giftType) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> searchProducts(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("categoryId") Long categoryId,
            @org.springframework.data.repository.query.Param("giftType") String giftType,
            @org.springframework.data.repository.query.Param("minPrice") java.math.BigDecimal minPrice,
            @org.springframework.data.repository.query.Param("maxPrice") java.math.BigDecimal maxPrice
    );
}
