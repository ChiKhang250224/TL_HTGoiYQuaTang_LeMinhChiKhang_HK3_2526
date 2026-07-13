package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStore_UserId(Long storeId);
    List<Product> findByStatus(String status);
}
