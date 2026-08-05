package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.ChangePasswordRequest;
import com.giftmatch.backend.dto.UpdateUserProfileRequest;
import com.giftmatch.backend.dto.UserProfileResponse;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService service;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> get(@AuthenticationPrincipal UserDetailsImpl details) {
        return ResponseEntity.ok(service.get(details.getUser()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> update(@Valid @RequestBody UpdateUserProfileRequest request,
                                                       @AuthenticationPrincipal UserDetailsImpl details) {
        return ResponseEntity.ok(service.update(details.getUser(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                                @AuthenticationPrincipal UserDetailsImpl details) {
        service.changePassword(details.getUser(), request);
        return ResponseEntity.noContent().build();
    }
}
