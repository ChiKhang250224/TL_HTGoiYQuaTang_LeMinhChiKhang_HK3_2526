package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ProductReportDecisionRequest;
import com.giftmatch.backend.dto.ProductReportResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.ProductReportService;
import com.giftmatch.backend.service.AuditLogService;
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
    private final AuditLogService auditLogService;

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
        ProductReportResponse response = service.decide(reportId, request, details.getUser());
        auditLogService.record(
                details.getUser(),
                "PRODUCT_REPORT_" + request.getStatus(),
                "PRODUCT_REPORT",
                reportId,
                "Xử lý báo cáo sản phẩm " + response.getProductName() + " với trạng thái " + request.getStatus()
        );
        return ResponseEntity.ok(response);
    }
}
