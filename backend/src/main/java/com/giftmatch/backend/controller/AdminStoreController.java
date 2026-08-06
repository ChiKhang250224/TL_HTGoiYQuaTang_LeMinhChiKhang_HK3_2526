package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.AdminStoreDecisionRequest;
import com.giftmatch.backend.dto.AdminStoreResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.AdminStoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stores")
@RequiredArgsConstructor
public class AdminStoreController {
    private final AdminStoreService service;

    @GetMapping
    public ResponseEntity<List<AdminStoreResponse>> search(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(service.search(status, keyword));
    }

    @PutMapping("/{storeId}/decision")
    public ResponseEntity<AdminStoreResponse> decide(
            @PathVariable Long storeId,
            @Valid @RequestBody AdminStoreDecisionRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.decide(storeId, request, details.getUser()));
    }
}
