package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductRequest;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.CategoryRepository;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        User store = userDetails.getUser();
        
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .giftType(request.getGiftType())
                .store(store)
                .status("PENDING")
                .build();
                
        if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId()).ifPresent(product::setCategory);
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        // In a real app, verify the product belongs to the store
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice
    ) {
        return ResponseEntity.ok(productRepository.searchProducts(keyword, categoryId, minPrice, maxPrice));
    }
}
