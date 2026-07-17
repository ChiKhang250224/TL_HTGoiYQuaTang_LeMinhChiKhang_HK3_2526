package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.RecipientProfileDto;
import com.giftmatch.backend.entity.RecipientProfile;
import com.giftmatch.backend.service.RecipientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class RecipientProfileController {
    private final RecipientProfileService profileService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecipientProfile>> getUserProfiles(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProfilesByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<RecipientProfile> createProfile(@PathVariable Long userId, @RequestBody RecipientProfileDto dto) {
        return ResponseEntity.ok(profileService.createProfile(userId, dto));
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long profileId) {
        profileService.deleteProfile(profileId);
        return ResponseEntity.ok().build();
    }
}
