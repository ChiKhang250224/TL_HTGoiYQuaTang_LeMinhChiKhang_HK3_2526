package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AiRecommendationResponse;
import com.giftmatch.backend.dto.HistoryResponse;
import com.giftmatch.backend.dto.RecommendationHistoryDto;
import com.giftmatch.backend.dto.RecommendationRequest;
import com.giftmatch.backend.dto.RecommendationResponse;
import com.giftmatch.backend.entity.AiModel;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.entity.RecipientProfile;
import com.giftmatch.backend.entity.RecommendationHistory;
import com.giftmatch.backend.entity.RecommendationItem;
import com.giftmatch.backend.entity.RecommendationPrediction;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.AiModelRepository;
import com.giftmatch.backend.repository.ProductRepository;
import com.giftmatch.backend.repository.RecipientProfileRepository;
import com.giftmatch.backend.repository.RecommendationHistoryRepository;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final RecommendationHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RecipientProfileRepository recipientProfileRepository;
    private final AiModelRepository aiModelRepository;

    @Transactional(readOnly = true)
    public List<HistoryResponse> getUserHistory(Long userId) {
        return historyRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RecommendationHistory saveHistory(RecommendationHistoryDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow();
        List<Product> products = productRepository.findAllById(dto.getRecommendedProductIds());
        RecipientProfile profile = findOwnedProfile(dto.getProfileId(), dto.getUserId());
        
        RecommendationHistory history = RecommendationHistory.builder()
                .user(user)
                .recipientProfile(profile)
                .recipientName(profile == null ? null : profile.getFullName())
                .aiInsights(dto.getAiInsights())
                .build();

        int rank = 1;
        for (Product product : products) {
            history.addRecommendationItem(RecommendationItem.builder()
                    .product(product)
                    .rankPosition(rank++)
                    .build());
        }
        return historyRepository.save(history);
    }

    @Transactional
    public Long saveRecommendation(
            Long userId,
            Long profileId,
            RecommendationRequest request,
            AiRecommendationResponse aiResponse,
            String aiInsights,
            List<RecommendationResponse.ProductRecommendation> rankedProducts
    ) {
        User user = userRepository.findById(userId).orElseThrow();
        RecipientProfile profile = findOwnedProfile(profileId, userId);
        AiModel model = aiModelRepository.findByModelVersion(aiResponse.getModelVersion())
                .orElse(null);

        RecommendationHistory history = RecommendationHistory.builder()
                .user(user)
                .recipientProfile(profile)
                .recipientName(normalizeRecipientName(
                        request.getRecipientName(), profile
                ))
                .gender(request.getGender())
                .relationshipToReceiver(request.getRelationship())
                .occasion(request.getOccasion())
                .budget(request.getBudget())
                .interests(request.getHobby())
                .receiverPersonality(request.getPersonality())
                .receiverAgeGroup(request.getAgeGroup())
                .relationshipCloseness(request.getRelationshipCloseness())
                .giverPreferenceStyle(request.getStyle())
                .model(model)
                .modelVersion(aiResponse.getModelVersion())
                .aiInsights(aiInsights)
                .build();

        Map<String, AiRecommendationResponse.GiftPrediction> predictionByName =
                new LinkedHashMap<>();
        for (AiRecommendationResponse.GiftPrediction prediction : aiResponse.getPredictions()) {
            predictionByName.put(prediction.getGiftName(), prediction);
            history.addPrediction(RecommendationPrediction.builder()
                    .giftName(prediction.getGiftName())
                    .giftType(prediction.getGiftType())
                    .score(BigDecimal.valueOf(prediction.getScore()))
                    .rankPosition(prediction.getRank())
                    .build());
        }

        Map<Long, Product> productsById = productRepository.findAllById(
                        rankedProducts.stream()
                                .map(RecommendationResponse.ProductRecommendation::getProductId)
                                .toList()
                ).stream()
                .collect(Collectors.toMap(Product::getProductId, Function.identity()));

        int rank = 1;
        for (RecommendationResponse.ProductRecommendation rankedProduct : rankedProducts) {
            Product product = productsById.get(rankedProduct.getProductId());
            if (product == null) {
                continue;
            }
            AiRecommendationResponse.GiftPrediction prediction =
                    predictionByName.get(rankedProduct.getPredictedGiftName());
            history.addRecommendationItem(RecommendationItem.builder()
                    .product(product)
                    .predictedGiftName(rankedProduct.getPredictedGiftName())
                    .predictedGiftType(prediction == null ? null : prediction.getGiftType())
                    .aiScore(prediction == null
                            ? null
                            : BigDecimal.valueOf(prediction.getScore()))
                    .matchScore(BigDecimal.valueOf(rankedProduct.getMatchScore()))
                    .rankPosition(rank++)
                    .build());
        }

        return historyRepository.save(history).getHistoryId();
    }

    @Transactional
    public HistoryResponse linkRecipientProfile(
            Long historyId,
            Long profileId,
            Long userId
    ) {
        RecommendationHistory history = historyRepository
                .findByHistoryIdAndUser_UserId(historyId, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy lịch sử gợi ý của người dùng."
                ));
        RecipientProfile profile = findOwnedProfile(profileId, userId);
        history.setRecipientProfile(profile);
        history.setRecipientName(profile.getFullName());
        return toResponse(historyRepository.save(history));
    }

    private HistoryResponse toResponse(RecommendationHistory history) {
        RecipientProfile profile = history.getRecipientProfile();
        HistoryResponse.Recipient recipient = profile == null
                ? null
                : HistoryResponse.Recipient.builder()
                    .profileId(profile.getProfileId())
                    .fullName(profile.getFullName())
                    .age(profile.getAge())
                    .relationship(profile.getRelationship())
                    .build();

        List<HistoryResponse.ProductItem> products = history.getRecommendationItems()
                .stream()
                .map(item -> {
                    Product product = item.getProduct();
                    return HistoryResponse.ProductItem.builder()
                        .productId(product.getProductId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .imageUrl(product.getImageUrl())
                        .giftType(product.getGiftType())
                        .aiGiftName(product.getAiGiftName())
                        .storeName(product.getStore().getFullName())
                        .predictedGiftName(item.getPredictedGiftName())
                        .predictedGiftType(item.getPredictedGiftType())
                        .aiScore(item.getAiScore())
                        .matchScore(item.getMatchScore())
                        .rankPosition(item.getRankPosition())
                        .build();
                })
                .toList();

        return HistoryResponse.builder()
                .historyId(history.getHistoryId())
                .createdAt(history.getCreatedAt())
                .aiInsights(history.getAiInsights())
                .modelVersion(history.getModelVersion())
                .occasion(history.getOccasion())
                .budget(history.getBudget())
                .interests(history.getInterests())
                .relationshipToReceiver(history.getRelationshipToReceiver())
                .recipientName(history.getRecipientName())
                .recipient(recipient)
                .products(products)
                .build();
    }

    private String normalizeRecipientName(
            String recipientName,
            RecipientProfile profile
    ) {
        if (profile != null) {
            return profile.getFullName();
        }
        if (recipientName == null || recipientName.isBlank()) {
            return null;
        }
        return recipientName.trim();
    }

    private RecipientProfile findOwnedProfile(Long profileId, Long userId) {
        if (profileId == null) {
            return null;
        }
        return recipientProfileRepository
                .findByProfileIdAndUser_UserId(profileId, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Hồ sơ người nhận không thuộc người dùng hiện tại."
                ));
    }
}
