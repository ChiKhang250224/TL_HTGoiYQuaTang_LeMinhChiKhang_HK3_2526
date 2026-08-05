package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.ProductReportDecisionRequest;
import com.giftmatch.backend.dto.ProductReportRequest;
import com.giftmatch.backend.dto.ProductReportResponse;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.ProductReport;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.ProductReportRepository;
import com.giftmatch.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductReportService {
    private static final Set<String> REASONS = Set.of(
            "MISLEADING_INFO", "INAPPROPRIATE_CONTENT", "WRONG_PRICE",
            "COUNTERFEIT_SUSPECTED", "OTHER"
    );
    private static final Set<String> DECISIONS = Set.of("RESOLVED", "REJECTED");
    private static final long DUPLICATE_WINDOW_HOURS = 24;

    private final ProductReportRepository reportRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ProductReportResponse create(User reporter, Long productId, ProductReportRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm."));
        if (!"APPROVED".equals(product.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ có thể báo cáo sản phẩm đang được hiển thị.");
        }

        String reason = normalize(request.getReason());
        if (!REASONS.contains(reason)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lý do báo cáo không hợp lệ.");
        }
        LocalDateTime duplicateAfter = LocalDateTime.now().minusHours(DUPLICATE_WINDOW_HOURS);
        if (reportRepository.existsByReporter_UserIdAndProduct_ProductIdAndCreatedAtAfter(
                reporter.getUserId(), productId, duplicateAfter)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Sản phẩm này đã được báo cáo trong vòng 24 giờ gần nhất."
            );
        }

        ProductReport report = ProductReport.builder()
                .product(product)
                .reporter(reporter)
                .reason(reason)
                .description(clean(request.getDescription()))
                .status("PENDING")
                .build();
        return ProductReportResponse.from(reportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public List<ProductReportResponse> getMine(User user) {
        return reportRepository.findByReporter_UserIdOrderByCreatedAtDesc(user.getUserId())
                .stream().map(ProductReportResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductReportResponse> getForAdmin(String status, String reason) {
        String normalizedStatus = nullableNormalize(status);
        String normalizedReason = nullableNormalize(reason);
        if (normalizedStatus != null && !Set.of("PENDING", "RESOLVED", "REJECTED").contains(normalizedStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái báo cáo không hợp lệ.");
        }
        if (normalizedReason != null && !REASONS.contains(normalizedReason)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Lý do báo cáo không hợp lệ.");
        }
        return reportRepository.findForAdmin(normalizedStatus, normalizedReason)
                .stream().map(ProductReportResponse::from).toList();
    }

    @Transactional
    public ProductReportResponse decide(
            Long reportId,
            ProductReportDecisionRequest request,
            User admin
    ) {
        ProductReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy báo cáo."));
        String decision = normalize(request.getStatus());
        if (!DECISIONS.contains(decision)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quyết định xử lý không hợp lệ.");
        }
        report.setStatus(decision);
        report.setResolutionNote(request.getResolutionNote().trim());
        report.setHandledBy(admin);
        report.setHandledAt(LocalDateTime.now());

        if (request.isHideProduct() && "RESOLVED".equals(decision)) {
            report.getProduct().setBusinessStatus("HIDDEN");
            productRepository.save(report.getProduct());
        }
        return ProductReportResponse.from(reportRepository.save(report));
    }

    private String normalize(String value) {
        return value.trim().toUpperCase();
    }

    private String nullableNormalize(String value) {
        return value == null || value.isBlank() ? null : normalize(value);
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
