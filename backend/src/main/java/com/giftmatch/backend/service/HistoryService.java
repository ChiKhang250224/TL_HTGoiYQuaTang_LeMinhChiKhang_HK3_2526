package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.RecommendationHistoryDto;
import com.giftmatch.backend.entity.RecommendationHistory;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.RecommendationHistoryRepository;
import com.giftmatch.backend.repository.UserRepository;
import com.giftmatch.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final RecommendationHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<RecommendationHistory> getUserHistory(Long userId) {
        return historyRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    public RecommendationHistory saveHistory(RecommendationHistoryDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow();
        List<Product> products = productRepository.findAllById(dto.getRecommendedProductIds());
        
        RecommendationHistory history = RecommendationHistory.builder()
                .user(user)
                .aiInsights(dto.getAiInsights())
                .recommendedProducts(products)
                .build();
                
        return historyRepository.save(history);
    }
}
