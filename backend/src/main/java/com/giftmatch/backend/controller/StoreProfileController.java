package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.StoreProfileDto;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.StoreProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store/profile")
@RequiredArgsConstructor
public class StoreProfileController {
    private final StoreProfileService service;

    @GetMapping("/me")
    public ResponseEntity<StoreProfileDto> get(@AuthenticationPrincipal UserDetailsImpl details) {
        return ResponseEntity.ok(service.get(details.getUser()));
    }

    @PutMapping("/me")
    public ResponseEntity<StoreProfileDto> update(@Valid @RequestBody StoreProfileDto request,
                                                   @AuthenticationPrincipal UserDetailsImpl details) {
        return ResponseEntity.ok(service.update(details.getUser(), request));
    }
}
