package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AiRecommendationRequest;
import com.giftmatch.backend.dto.AiRecommendationResponse;
import com.giftmatch.backend.dto.RecommendationRequest;
import com.giftmatch.backend.dto.RecommendationResponse;
import com.giftmatch.backend.entity.Product;
import com.giftmatch.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(RecommendationService.class);
    private static final JsonMapper AI_JSON_MAPPER =
            JsonMapper.builder().build();
    private static final int MAX_PRODUCTS = 24;
    private static final BigDecimal MODEL_BUDGET_TO_VND = BigDecimal.valueOf(1000);

    private final RestClient aiRestClient;
    private final AiResilienceGuard aiResilienceGuard;
    private final ProductRepository productRepository;
    private final HistoryService historyService;

    @Transactional
    public RecommendationResponse recommend(RecommendationRequest request, Long userId) {
        AiRecommendationRequest aiRequest = AiRecommendationRequest.builder()
                .gender(request.getGender())
                .relationshipToReceiver(request.getRelationship())
                .occasion(request.getOccasion())
                .budget(request.getBudget())
                .interests(request.getHobby())
                .receiverPersonality(request.getPersonality())
                .receiverAgeGroup(request.getAgeGroup())
                .relationshipCloseness(request.getRelationshipCloseness())
                .giverPreferenceStyle(request.getStyle())
                .topK(request.getTopK())
                .build();

        AiRecommendationResponse aiResponse;
        try {
            String requestJson = AI_JSON_MAPPER.writeValueAsString(aiRequest);
            String responseJson = aiResilienceGuard.execute(() -> aiRestClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(requestJson)
                    .retrieve()
                    .body(String.class));
            aiResponse = AI_JSON_MAPPER.readValue(
                    responseJson,
                    AiRecommendationResponse.class
            );
        } catch (RestClientResponseException exception) {
            LOGGER.error(
                    "AI service rejected POST /predict with status {} and body: {}",
                    exception.getStatusCode(),
                    exception.getResponseBodyAsString(),
                    exception
            );
            if (exception.getStatusCode().is4xxClientError()) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "AI từ chối dữ liệu khảo sát: " + exception.getResponseBodyAsString(),
                        exception
                );
            }
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Dịch vụ AI đang gặp lỗi tạm thời. Vui lòng thử lại sau.",
                    exception
            );
        } catch (Exception exception) {
            LOGGER.error(
                    "Cannot call AI service POST /predict: {} - {}",
                    exception.getClass().getName(),
                    exception.getMessage(),
                    exception
            );
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Dịch vụ AI chưa sẵn sàng. Hãy kiểm tra model và AI service.",
                    exception
            );
        }

        if (aiResponse == null || aiResponse.getPredictions() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "Dịch vụ AI trả về dữ liệu không hợp lệ."
            );
        }

        BigDecimal maxPrice = request.getBudget().multiply(MODEL_BUDGET_TO_VND);
        List<Product> availableProducts =
                productRepository.findByStatusAndBusinessStatusAndPriceLessThanEqualOrderByRecommendCountDesc(
                        "APPROVED", "IN_STOCK", maxPrice
                );

        List<RecommendationResponse.ProductRecommendation> rankedProducts =
                rankProducts(availableProducts, aiResponse.getPredictions(), request);

        String insights = buildInsights(request, aiResponse);
        Long historyId = historyService.saveRecommendation(
                userId,
                request.getRecipientProfileId(),
                request,
                aiResponse,
                insights,
                rankedProducts
        );

        return RecommendationResponse.builder()
                .historyId(historyId)
                .recipientName(request.getRecipientName())
                .recipientProfileId(request.getRecipientProfileId())
                .modelVersion(aiResponse.getModelVersion())
                .predictedGifts(aiResponse.getPredictions())
                .products(rankedProducts)
                .build();
    }

    private String buildInsights(
            RecommendationRequest request,
            AiRecommendationResponse aiResponse
    ) {
        String gifts = aiResponse.getPredictions().stream()
                .limit(5)
                .map(prediction -> String.format(
                        Locale.ROOT,
                        "%s (%.1f%%)",
                        prediction.getGiftName(),
                        prediction.getScore() * 100
                ))
                .reduce((left, right) -> left + ", " + right)
                .orElse("Chưa có dự đoán");
        return "Dịp " + request.getOccasion()
                + ", sở thích " + request.getHobby()
                + ". Top gợi ý: " + gifts + ".";
    }

    private List<RecommendationResponse.ProductRecommendation> rankProducts(
            List<Product> products,
            List<AiRecommendationResponse.GiftPrediction> predictions,
            RecommendationRequest request
    ) {
        List<RecommendationResponse.ProductRecommendation> ranked = new ArrayList<>();
        Set<Long> addedProductIds = new HashSet<>();

        for (AiRecommendationResponse.GiftPrediction prediction : predictions) {
            for (Product product : products) {
                if (addedProductIds.contains(product.getProductId())) {
                    continue;
                }

                boolean exactGift = equalsNormalized(
                        product.getAiGiftName(), prediction.getGiftName()
                );
                boolean sameType = equalsNormalized(
                        product.getGiftType(), prediction.getGiftType()
                );
                if (!exactGift && !sameType) {
                    continue;
                }

                double matchScore = exactGift
                        ? prediction.getScore()
                        : prediction.getScore() * 0.85;
                ranked.add(toProductRecommendation(
                        product,
                        prediction,
                        matchScore,
                        exactGift,
                        request
                ));
                addedProductIds.add(product.getProductId());
            }
        }

        return ranked.stream()
                .sorted(Comparator.comparingDouble(
                        RecommendationResponse.ProductRecommendation::getMatchScore
                ).reversed())
                .limit(MAX_PRODUCTS)
                .toList();
    }

    private RecommendationResponse.ProductRecommendation toProductRecommendation(
            Product product,
            AiRecommendationResponse.GiftPrediction prediction,
            double matchScore,
            boolean exactGift,
            RecommendationRequest request
    ) {
        return RecommendationResponse.ProductRecommendation.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .storeName(product.getStore().getFullName())
                .giftType(product.getGiftType())
                .aiGiftName(product.getAiGiftName())
                .predictedGiftName(prediction.getGiftName())
                .matchScore(matchScore)
                .matchSource(exactGift ? "EXACT_LABEL" : "GIFT_TYPE_FALLBACK")
                .matchReason(buildProductReason(product, prediction, exactGift, request))
                .build();
    }

    private String buildProductReason(
            Product product,
            AiRecommendationResponse.GiftPrediction prediction,
            boolean exactGift,
            RecommendationRequest request
    ) {
        String modelReason = exactGift
                ? "Mô hình dự đoán đúng nhãn quà \"" + prediction.getGiftName() + "\"."
                : "Sản phẩm cùng loại quà \"" + prediction.getGiftType()
                    + "\" với nhãn mô hình dự đoán; điểm được áp dụng hệ số dự phòng 0,85.";
        String catalogReason = " Backend chỉ giữ sản phẩm đã duyệt, còn hàng và có giá "
                + product.getPrice().toPlainString()
                + " đồng trong ngân sách khảo sát."
                + " Ngữ cảnh chính: dịp " + request.getOccasion()
                + ", sở thích " + request.getHobby() + ".";
        return modelReason + catalogReason;
    }

    private boolean equalsNormalized(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return left.trim().toLowerCase(Locale.ROOT)
                .equals(right.trim().toLowerCase(Locale.ROOT));
    }
}
