package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.RecommendationFeedbackRequest;
import com.giftmatch.backend.dto.RecommendationFeedbackResponse;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.RecommendationFeedback;
import com.giftmatch.backend.entity.RecommendationHistory;
import com.giftmatch.backend.entity.RecommendationItem;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.repository.RecommendationFeedbackRepository;
import com.giftmatch.backend.repository.RecommendationHistoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationFeedbackServiceTests {
    @Mock
    private RecommendationHistoryRepository historyRepository;

    @Mock
    private RecommendationFeedbackRepository feedbackRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private RecommendationFeedbackService feedbackService;

    @Test
    void savesVoteAndSelectedRecommendedProduct() {
        Long userId = 10L;
        Long historyId = 30L;
        Product product = Product.builder().productId(40L).build();
        RecommendationItem item = RecommendationItem.builder()
                .product(product)
                .selected(false)
                .build();
        RecommendationHistory history = RecommendationHistory.builder()
                .historyId(historyId)
                .user(User.builder().userId(userId).build())
                .build();
        history.addRecommendationItem(item);

        RecommendationFeedbackRequest request =
                new RecommendationFeedbackRequest();
        request.setRating(5);
        request.setRelevant(true);
        request.setSelectedProductId(product.getProductId());
        request.setComment("Gợi ý đúng nhu cầu.");

        when(historyRepository.findByHistoryIdAndUser_UserId(
                historyId,
                userId
        )).thenReturn(Optional.of(history));
        when(feedbackRepository.findByHistory_HistoryId(historyId))
                .thenReturn(Optional.empty());
        when(feedbackRepository.save(any(RecommendationFeedback.class)))
                .thenAnswer(invocation -> {
                    RecommendationFeedback feedback = invocation.getArgument(0);
                    feedback.setFeedbackId(50L);
                    feedback.setUpdatedAt(LocalDateTime.now());
                    return feedback;
                });

        RecommendationFeedbackResponse response = feedbackService.save(
                historyId,
                userId,
                request
        );

        assertThat(response.getRating()).isEqualTo(5);
        assertThat(response.getRelevant()).isTrue();
        assertThat(response.getSelectedProductId())
                .isEqualTo(product.getProductId());
        assertThat(item.getSelected()).isTrue();
    }
}
