package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductReportRequest;
import com.giftmatch.backend.dto.ProductReportResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.ProductReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-reports")
@RequiredArgsConstructor
public class ProductReportController {
    private final ProductReportService service;

    @PostMapping("/{productId}")
    public ResponseEntity<ProductReportResponse> create(
            @PathVariable Long productId,
            @Valid @RequestBody ProductReportRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(details.getUser(), productId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProductReportResponse>> getMine(
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.getMine(details.getUser()));
    }
}
