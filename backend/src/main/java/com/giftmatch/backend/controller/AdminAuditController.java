package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.AuditLogResponse;
import com.giftmatch.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AdminAuditController {
    private final AuditLogService service;

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> search(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String targetType,
            @RequestParam(defaultValue = "100") int limit
    ) {
        return ResponseEntity.ok(service.search(action, targetType, limit));
    }
}
