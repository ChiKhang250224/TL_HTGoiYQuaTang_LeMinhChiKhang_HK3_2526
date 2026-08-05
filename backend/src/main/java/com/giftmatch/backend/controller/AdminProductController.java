package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductLabelRequest;
import com.giftmatch.backend.dto.ProductLabelItem;
import com.giftmatch.backend.dto.ProductRejectionRequest;
import com.giftmatch.backend.entity.GiftLabel;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.repository.GiftLabelRepository;
import com.giftmatch.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
    private static final Set<String> VALID_STATUSES =
            Set.of("PENDING", "APPROVED", "REJECTED");

    private final ProductRepository productRepository;
    private final GiftLabelRepository giftLabelRepository;

    @GetMapping("/taxonomy")
    public ResponseEntity<Map<String, String>> getTaxonomy() {
        Map<String, String> taxonomy = new java.util.LinkedHashMap<>();
        giftLabelRepository.findByIsActiveTrueOrderByGiftType_DisplayNameAscDisplayNameAsc()
                .forEach(label -> taxonomy.put(
                        label.getDisplayName(),
                        label.getGiftType().getDisplayName()
                ));
        return ResponseEntity.ok(taxonomy);
    }

    @GetMapping("/unlabeled")
    public ResponseEntity<List<ProductLabelItem>> getUnlabeledProducts() {
        return ResponseEntity.ok(
                productRepository.findByAiGiftNameIsNullOrAiGiftName("")
                        .stream()
                        .map(ProductLabelItem::from)
                        .toList()
        );
    }

    @GetMapping("/pending")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProductLabelItem>> getPendingProducts() {
        return ResponseEntity.ok(
                productRepository.findByStatusOrderByCreatedAtAsc("PENDING")
                        .stream()
                        .map(ProductLabelItem::from)
                        .toList()
        );
    }

    @PutMapping("/{productId}/label")
    public ResponseEntity<ProductLabelItem> labelProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductLabelRequest request
    ) {
        Product product = productRepository.findById(productId).orElseThrow();
        GiftLabel label = giftLabelRepository
                .findByDisplayNameAndIsActiveTrue(request.getAiGiftName())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Nhãn quà AI không tồn tại hoặc đã ngừng sử dụng."
                ));
        product.setGiftLabel(label);
        product.setAiGiftName(label.getDisplayName());
        product.setGiftType(label.getGiftType().getDisplayName());
        if (request.getStatus() != null) {
            String status = request.getStatus().trim().toUpperCase();
            if (!VALID_STATUSES.contains(status)) {
                throw new IllegalArgumentException("Trạng thái sản phẩm không hợp lệ.");
            }
            product.setStatus(status);
        }
        return ResponseEntity.ok(ProductLabelItem.from(productRepository.save(product)));
    }

    @PutMapping("/{productId}/approve")
    @Transactional
    public ResponseEntity<ProductLabelItem> approveProduct(@PathVariable Long productId) {
        Product product = findProduct(productId);
        if (product.getGiftLabel() == null
                || product.getAiGiftName() == null
                || product.getAiGiftName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "San pham can duoc gan nhan AI truoc khi phe duyet."
            );
        }
        product.setStatus("APPROVED");
        product.setRejectionReason(null);
        return ResponseEntity.ok(ProductLabelItem.from(productRepository.save(product)));
    }

    @PutMapping("/{productId}/reject")
    @Transactional
    public ResponseEntity<ProductLabelItem> rejectProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRejectionRequest request
    ) {
        Product product = findProduct(productId);
        product.setStatus("REJECTED");
        product.setRejectionReason(request.getReason().trim());
        return ResponseEntity.ok(ProductLabelItem.from(productRepository.save(product)));
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Khong tim thay san pham."
                ));
    }
}
