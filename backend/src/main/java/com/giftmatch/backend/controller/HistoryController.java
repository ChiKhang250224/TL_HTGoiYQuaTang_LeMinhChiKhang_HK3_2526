package com.giftmatch.backend.controller;

import com.giftmatch.backend.dto.RecommendationHistoryDto;
import com.giftmatch.backend.dto.HistoryResponse;
import com.giftmatch.backend.dto.RecommendationFeedbackRequest;
import com.giftmatch.backend.dto.RecommendationFeedbackResponse;
import com.giftmatch.backend.entity.RecommendationHistory;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.HistoryService;
import com.giftmatch.backend.service.RecommendationFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {
    private final HistoryService historyService;
    private final RecommendationFeedbackService feedbackService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HistoryResponse>> getUserHistory(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        boolean isOwner = userDetails.getUser().getUserId().equals(userId);
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return ResponseEntity.ok(historyService.getUserHistory(userId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<HistoryResponse>> getMyHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(
                historyService.getUserHistory(userDetails.getUser().getUserId())
        );
    }

    @PostMapping
    public ResponseEntity<RecommendationHistory> saveHistory(
            @RequestBody RecommendationHistoryDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        dto.setUserId(userDetails.getUser().getUserId());
        return ResponseEntity.ok(historyService.saveHistory(dto));
    }

    @PutMapping("/{historyId}/feedback")
    public ResponseEntity<RecommendationFeedbackResponse> saveFeedback(
            @PathVariable Long historyId,
            @Valid @RequestBody RecommendationFeedbackRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(feedbackService.save(
                historyId,
                userDetails.getUser().getUserId(),
                request
        ));
    }

    @GetMapping("/{historyId}/feedback")
    public ResponseEntity<RecommendationFeedbackResponse> getFeedback(
            @PathVariable Long historyId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        RecommendationFeedbackResponse feedback = feedbackService.get(
                historyId,
                userDetails.getUser().getUserId()
        );
        return feedback == null
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(feedback);
    }

    @PutMapping("/{historyId}/recipient-profile/{profileId}")
    public ResponseEntity<HistoryResponse> linkRecipientProfile(
            @PathVariable Long historyId,
            @PathVariable Long profileId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(historyService.linkRecipientProfile(
                historyId,
                profileId,
                userDetails.getUser().getUserId()
        ));
    }
}
