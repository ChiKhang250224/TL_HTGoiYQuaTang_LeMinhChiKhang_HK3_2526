package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.RecommendationHistoryDto;
import com.giftmatch.backend.entity.RecommendationHistory;
import com.giftmatch.backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {
    private final HistoryService historyService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationHistory>> getUserHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(historyService.getUserHistory(userId));
    }

    @PostMapping
    public ResponseEntity<RecommendationHistory> saveHistory(@RequestBody RecommendationHistoryDto dto) {
        return ResponseEntity.ok(historyService.saveHistory(dto));
    }
}
