package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.FavoriteDto;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @GetMapping("/me")
    public ResponseEntity<List<FavoriteDto>> getCurrentUserFavorites(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(
                favoriteService.getUserFavorites(userDetails.getUser())
        );
    }

    @PostMapping("/{productId}")
    public ResponseEntity<FavoriteDto> addFavorite(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                favoriteService.addFavorite(userDetails.getUser(), productId)
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        favoriteService.removeFavorite(userDetails.getUser(), productId);
        return ResponseEntity.noContent().build();
    }
}
