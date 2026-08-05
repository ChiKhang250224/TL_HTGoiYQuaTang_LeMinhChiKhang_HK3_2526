package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductReportDecisionRequest;
import com.giftmatch.backend.dto.ProductReportResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.ProductReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/product-reports")
@RequiredArgsConstructor
public class AdminProductReportController {
    private final ProductReportService service;

    @GetMapping
    public ResponseEntity<List<ProductReportResponse>> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String reason
    ) {
        return ResponseEntity.ok(service.getForAdmin(status, reason));
    }

    @PutMapping("/{reportId}/decision")
    public ResponseEntity<ProductReportResponse> decide(
            @PathVariable Long reportId,
            @Valid @RequestBody ProductReportDecisionRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.decide(reportId, request, details.getUser()));
    }
}
