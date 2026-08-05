package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.ProductReport;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductReportResponse {
    private Long reportId;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String storeName;
    private Long reporterId;
    private String reporterName;
    private String reporterEmail;
    private String reason;
    private String description;
    private String status;
    private String resolutionNote;
    private String handledByName;
    private LocalDateTime handledAt;
    private LocalDateTime createdAt;

    public static ProductReportResponse from(ProductReport report) {
        return ProductReportResponse.builder()
                .reportId(report.getReportId())
                .productId(report.getProduct().getProductId())
                .productName(report.getProduct().getName())
                .productImageUrl(report.getProduct().getImageUrl())
                .storeName(report.getProduct().getStore().getFullName())
                .reporterId(report.getReporter().getUserId())
                .reporterName(report.getReporter().getFullName())
                .reporterEmail(report.getReporter().getEmail())
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus())
                .resolutionNote(report.getResolutionNote())
                .handledByName(report.getHandledBy() == null ? null : report.getHandledBy().getFullName())
                .handledAt(report.getHandledAt())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
