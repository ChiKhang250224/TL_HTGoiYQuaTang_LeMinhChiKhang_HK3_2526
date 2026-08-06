package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductRequest;
import com.giftmatch.backend.dto.ProductResponse;
import com.giftmatch.backend.dto.ProductBusinessStatusRequest;
import com.giftmatch.backend.entity.GiftLabel;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.CategoryRepository;
import com.giftmatch.backend.repository.GiftLabelRepository;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.AdminStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final GiftLabelRepository giftLabelRepository;
    private final AdminStoreService adminStoreService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(
                productRepository.findByStatusAndBusinessStatus("APPROVED", "IN_STOCK")
                        .stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    @GetMapping("/store/me")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductResponse>> getCurrentStoreProducts(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        requireStoreOrAdmin(userDetails);
        return ResponseEntity.ok(
                productRepository.findByStore_UserId(userDetails.getUser().getUserId())
                        .stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    @GetMapping("/featured")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts(
            @RequestParam(defaultValue = "8") int limit
    ) {
        int safeLimit = Math.max(1, Math.min(limit, 12));
        return ResponseEntity.ok(
                productRepository.findFeaturedProducts(PageRequest.of(0, safeLimit))
                        .stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<ProductResponse> getProductDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy sản phẩm."
                ));

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = product.getStore() != null
                && product.getStore().getUserId().equals(
                        userDetails.getUser().getUserId()
                );
        if (!"APPROVED".equals(product.getStatus())
                && !isAdmin
                && !isOwner) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Sản phẩm chưa sẵn sàng để hiển thị."
            );
        }
        if (!"IN_STOCK".equals(product.getBusinessStatus()) && !isAdmin && !isOwner) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "San pham hien khong kha dung.");
        }

        if ("APPROVED".equals(product.getStatus()) && !isAdmin && !isOwner) {
            product.setViewCount(
                    (product.getViewCount() == null ? 0 : product.getViewCount()) + 1
            );
        }
        return ResponseEntity.ok(ProductResponse.from(product));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        requireStoreOrAdmin(userDetails);
        requireApprovedStore(userDetails);
        User store = userDetails.getUser();
        GiftLabel giftLabel = getGiftLabel(request.getAiGiftName());
        
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .giftType(giftLabel.getGiftType().getDisplayName())
                .aiGiftName(giftLabel.getDisplayName())
                .giftLabel(giftLabel)
                .store(store)
                .status("PENDING")
                .build();
                
        if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId()).ifPresent(product::setCategory);
        }

        return ResponseEntity.ok(
                ProductResponse.from(productRepository.save(product))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Product product = getOwnedProductOrAdmin(id, userDetails);
        requireApprovedStore(userDetails);
        productRepository.delete(product);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Product product = getOwnedProductOrAdmin(id, userDetails);
        requireApprovedStore(userDetails);
        GiftLabel giftLabel = getGiftLabel(request.getAiGiftName());
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setGiftType(giftLabel.getGiftType().getDisplayName());
        product.setAiGiftName(giftLabel.getDisplayName());
        product.setGiftLabel(giftLabel);
        
        if (request.getCategoryId() != null) {
            categoryRepository.findById(request.getCategoryId()).ifPresent(product::setCategory);
        }

        if (!isAdmin(userDetails)) {
            product.setStatus("PENDING");
            product.setRejectionReason(null);
        }

        return ResponseEntity.ok(
                ProductResponse.from(productRepository.save(product))
        );
    }

    @PatchMapping("/{id}/business-status")
    @Transactional
    public ResponseEntity<ProductResponse> updateBusinessStatus(
            @PathVariable Long id,
            @Valid @RequestBody ProductBusinessStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Product product = getOwnedProductOrAdmin(id, userDetails);
        requireApprovedStore(userDetails);
        String status = request.getBusinessStatus().trim().toUpperCase();
        if (!List.of("IN_STOCK", "OUT_OF_STOCK", "HIDDEN", "DISCONTINUED").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trang thai kinh doanh khong hop le.");
        }
        product.setBusinessStatus(status);
        return ResponseEntity.ok(ProductResponse.from(productRepository.save(product)));
    }

    @GetMapping("/search")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String giftType,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice
    ) {
        String normalizedKeyword = normalizeFilter(keyword);
        String normalizedGiftType = normalizeFilter(giftType);
        if ((minPrice != null && minPrice.signum() < 0)
                || (maxPrice != null && maxPrice.signum() < 0)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khoảng giá không thể là số âm.");
        }
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giá tối thiểu không thể lớn hơn giá tối đa.");
        }
        return ResponseEntity.ok(
                productRepository.searchProducts(
                                normalizedKeyword,
                                categoryId,
                                normalizedGiftType,
                                minPrice,
                                maxPrice
                        )
                        .stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    private String normalizeFilter(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }

    private GiftLabel getGiftLabel(String displayName) {
        return giftLabelRepository.findByDisplayNameAndIsActiveTrue(displayName)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nhãn quà AI không tồn tại hoặc đã ngừng sử dụng."
                ));
    }

    private Product getOwnedProductOrAdmin(Long productId, UserDetailsImpl userDetails) {
        requireStoreOrAdmin(userDetails);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay san pham."
                ));
        if (!isAdmin(userDetails) && !isOwner(product, userDetails)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Khong co quyen thay doi san pham cua cua hang khac."
            );
        }
        return product;
    }

    private void requireStoreOrAdmin(UserDetailsImpl userDetails) {
        Role role = userDetails.getUser().getRole();
        if (role != Role.STORE && role != Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Chuc nang chi danh cho Store hoac Admin."
            );
        }
    }

    private boolean isAdmin(UserDetailsImpl userDetails) {
        return userDetails.getUser().getRole() == Role.ADMIN;
    }

    private boolean isOwner(Product product, UserDetailsImpl userDetails) {
        return product.getStore() != null
                && product.getStore().getUserId().equals(userDetails.getUser().getUserId());
    }

    private void requireApprovedStore(UserDetailsImpl userDetails) {
        if (adminStoreService != null && userDetails.getUser().getRole() == Role.STORE) {
            adminStoreService.requireApproved(userDetails.getUser().getUserId());
        }
    }
}
