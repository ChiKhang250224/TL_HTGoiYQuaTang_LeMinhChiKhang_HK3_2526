package com.giftmatch.backend.controller;

import com.giftmatch.backend.entity.Favorite;
import com.giftmatch.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    @PostMapping("/toggle")
    public ResponseEntity<Boolean> toggleFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        return ResponseEntity.ok(favoriteService.toggleFavorite(userId, productId));
    }
}
