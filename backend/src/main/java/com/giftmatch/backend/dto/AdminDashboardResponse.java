package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long activeUsers;
    private long customerUsers;
    private long storeUsers;
    private long pendingStores;
    private long totalProducts;
    private long pendingProducts;
    private long approvedProducts;
    private long totalRecommendations;
    private long totalFeedback;
    private long totalNotifications;
    private String activeModelVersion;
    private Double top5Accuracy;
}
