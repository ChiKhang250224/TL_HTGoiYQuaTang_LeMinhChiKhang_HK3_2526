package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.RecommendationFeedbackRequest;
import com.giftmatch.backend.dto.RecommendationFeedbackResponse;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.RecommendationFeedback;
import com.giftmatch.backend.entity.RecommendationHistory;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.repository.RecommendationFeedbackRepository;
import com.giftmatch.backend.repository.RecommendationHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecommendationFeedbackService {
    private final RecommendationHistoryRepository historyRepository;
    private final RecommendationFeedbackRepository feedbackRepository;
    private final ProductRepository productRepository;

    @Transactional
    public RecommendationFeedbackResponse save(
            Long historyId,
            Long userId,
            RecommendationFeedbackRequest request
    ) {
        RecommendationHistory history = historyRepository
                .findByHistoryIdAndUser_UserId(historyId, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lịch sử gợi ý không tồn tại hoặc không thuộc người dùng hiện tại."
                ));

        Product selectedProduct = null;
        history.getRecommendationItems()
                .forEach(item -> item.setSelected(false));
        if (request.getSelectedProductId() != null) {
            selectedProduct = history.getRecommendationItems().stream()
                    .filter(item -> item.getProduct().getProductId()
                            .equals(request.getSelectedProductId()))
                    .findFirst()
                    .map(item -> {
                        item.setSelected(true);
                        return item.getProduct();
                    })
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Sản phẩm được chọn không thuộc kết quả gợi ý này."
                    ));
        }

        RecommendationFeedback feedback = feedbackRepository
                .findByHistory_HistoryId(historyId)
                .orElseGet(RecommendationFeedback::new);
        feedback.setHistory(history);
        feedback.setUser(history.getUser());
        feedback.setSelectedProduct(selectedProduct);
        feedback.setRating(request.getRating());
        feedback.setIsRelevant(request.getRelevant());
        feedback.setComment(request.getComment());

        return toResponse(feedbackRepository.save(feedback));
    }

    @Transactional(readOnly = true)
    public RecommendationFeedbackResponse get(
            Long historyId,
            Long userId
    ) {
        historyRepository
                .findByHistoryIdAndUser_UserId(historyId, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lịch sử gợi ý không tồn tại hoặc không thuộc người dùng hiện tại."
                ));
        return feedbackRepository.findByHistory_HistoryId(historyId)
                .map(this::toResponse)
                .orElse(null);
    }

    private RecommendationFeedbackResponse toResponse(
            RecommendationFeedback feedback
    ) {
        return RecommendationFeedbackResponse.builder()
                .feedbackId(feedback.getFeedbackId())
                .historyId(feedback.getHistory().getHistoryId())
                .rating(feedback.getRating())
                .relevant(feedback.getIsRelevant())
                .selectedProductId(feedback.getSelectedProduct() == null
                        ? null
                        : feedback.getSelectedProduct().getProductId())
                .comment(feedback.getComment())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }
}
