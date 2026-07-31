package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.GiftNotificationResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.GiftNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class GiftNotificationController {
    private final GiftNotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity<List<GiftNotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(notificationService.getNotifications(
                userDetails.getUser().getUserId()
        ));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(Map.of(
                "count",
                notificationService.getUnreadCount(
                        userDetails.getUser().getUserId()
                )
        ));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<GiftNotificationResponse> markRead(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(notificationService.markRead(
                notificationId,
                userDetails.getUser().getUserId()
        ));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        notificationService.markAllRead(
                userDetails.getUser().getUserId()
        );
        return ResponseEntity.noContent().build();
    }
}
