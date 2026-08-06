package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.AdminUserResponse;
import com.giftmatch.backend.dto.AdminUserStatusRequest;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminUserService service;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(service.search(keyword, role, active));
    }

    @PutMapping("/{userId}/active")
    public ResponseEntity<AdminUserResponse> setActive(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl details
    ) {
        return ResponseEntity.ok(service.setActive(userId, request.getActive(), details.getUser()));
    }
}
