package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.StoreAnalyticsResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/store/analytics")
@RequiredArgsConstructor
public class StoreAnalyticsController {
    private final AnalyticsService service;

    @GetMapping
    public ResponseEntity<StoreAnalyticsResponse> get(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.getStoreAnalytics(details.getUser().getUserId(), from, to));
    }
}
