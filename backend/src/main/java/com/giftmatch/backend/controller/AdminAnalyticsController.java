package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.*;
import com.giftmatch.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {
    private final AnalyticsService service;
    private final RestClient aiRestClient;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(service.getAdminDashboard());
    }

    @GetMapping("/feedback")
    public ResponseEntity<AdminAiFeedbackResponse> feedback() {
        return ResponseEntity.ok(service.getAiFeedback());
    }

    @GetMapping("/data-quality")
    public ResponseEntity<DataQualityResponse> dataQuality() {
        return ResponseEntity.ok(service.getDataQuality());
    }

    @GetMapping(value = "/feedback/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportFeedback() {
        byte[] content = ("\uFEFF" + service.exportValidatedFeedbackCsv()).getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=giftmatch_feedback.csv")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(content);
    }

    @GetMapping("/ai-health")
    public ResponseEntity<Map<String, Object>> aiHealth() {
        try {
            Map response = aiRestClient.get().uri("/health").retrieve().body(Map.class);
            return ResponseEntity.ok(Map.of("available", true, "details", response == null ? Map.of() : response));
        } catch (Exception exception) {
            return ResponseEntity.ok(Map.of("available", false, "message", "AI Service không phản hồi."));
        }
    }
}
