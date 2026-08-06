package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.StoreProfile;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminStoreResponse {
    private Long storeId;
    private Long ownerUserId;
    private String ownerEmail;
    private String storeName;
    private String phone;
    private String address;
    private String logoUrl;
    private String description;
    private String status;
    private String reviewNote;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

    public static AdminStoreResponse from(StoreProfile profile) {
        return AdminStoreResponse.builder()
                .storeId(profile.getStoreId())
                .ownerUserId(profile.getOwner().getUserId())
                .ownerEmail(profile.getOwner().getEmail())
                .storeName(profile.getStoreName())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .logoUrl(profile.getLogoUrl())
                .description(profile.getDescription())
                .status(profile.getStatus())
                .reviewNote(profile.getReviewNote())
                .reviewedBy(profile.getReviewedBy() == null
                        ? null : profile.getReviewedBy().getFullName())
                .reviewedAt(profile.getReviewedAt())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
