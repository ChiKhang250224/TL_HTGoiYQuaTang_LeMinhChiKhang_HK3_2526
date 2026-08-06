package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.RecipientProfileDto;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.RecipientProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class RecipientProfileController {
    private final RecipientProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<List<RecipientProfileDto>> getMyProfiles(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(profileService.getProfilesByUser(
                userDetails.getUser().getUserId()
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecipientProfileDto>> getUserProfiles(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        verifyOwner(userId, userDetails);
        return ResponseEntity.ok(profileService.getProfilesByUser(userId));
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<RecipientProfileDto> getProfile(
            @PathVariable Long profileId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(profileService.getProfile(
                profileId,
                userDetails.getUser().getUserId()
        ));
    }

    @PostMapping("/me")
    public ResponseEntity<RecipientProfileDto> createMyProfile(
            @Valid @RequestBody RecipientProfileDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(profileService.createProfile(
                userDetails.getUser().getUserId(),
                dto
        ));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<RecipientProfileDto> createProfile(
            @PathVariable Long userId,
            @Valid @RequestBody RecipientProfileDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        verifyOwner(userId, userDetails);
        return ResponseEntity.ok(profileService.createProfile(userId, dto));
    }

    @PutMapping("/{profileId}")
    public ResponseEntity<RecipientProfileDto> updateProfile(
            @PathVariable Long profileId,
            @Valid @RequestBody RecipientProfileDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(profileService.updateProfile(
                profileId,
                userDetails.getUser().getUserId(),
                dto
        ));
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long profileId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        profileService.deleteProfile(
                profileId,
                userDetails.getUser().getUserId()
        );
        return ResponseEntity.noContent().build();
    }

    private void verifyOwner(
            Long userId,
            UserDetailsImpl userDetails
    ) {
        boolean isOwner = userDetails.getUser().getUserId().equals(userId);
        if (!isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
