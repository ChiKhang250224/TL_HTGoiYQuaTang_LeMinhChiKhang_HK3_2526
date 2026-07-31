package com.giftmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class GiftNotificationResponse {
    private Long notificationId;
    private Long profileId;
    private String recipientName;
    private String eventName;
    private String title;
    private String message;
    private LocalDate eventDate;
    private long daysRemaining;
    private Boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
