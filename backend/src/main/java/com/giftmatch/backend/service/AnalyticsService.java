package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.*;
import com.giftmatch.backend.entity.*;
import com.giftmatch.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final UserRepository userRepository;
    private final StoreProfileRepository storeProfileRepository;
    private final ProductRepository productRepository;
    private final RecommendationHistoryRepository historyRepository;
    private final RecommendationFeedbackRepository feedbackRepository;
    private final GiftNotificationRepository notificationRepository;
    private final AiModelRepository aiModelRepository;
    private final FavoriteRepository favoriteRepository;
    private final RecommendationItemRepository itemRepository;
    private final RecommendationPredictionRepository predictionRepository;
    private final GiftLabelRepository giftLabelRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        AiModel activeModel = aiModelRepository.findFirstByStatusOrderByActivatedAtDesc("ACTIVE").orElse(null);
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByIsActiveTrue())
                .customerUsers(userRepository.countByRole(Role.CUSTOMER))
                .storeUsers(userRepository.countByRole(Role.STORE))
                .pendingStores(storeProfileRepository.countByStatus("PENDING"))
                .totalProducts(productRepository.count())
                .pendingProducts(productRepository.countByStatus("PENDING"))
                .approvedProducts(productRepository.countByStatus("APPROVED"))
                .totalRecommendations(historyRepository.count())
                .totalFeedback(feedbackRepository.count())
                .totalNotifications(notificationRepository.count())
                .activeModelVersion(activeModel == null ? null : activeModel.getModelVersion())
                .top5Accuracy(activeModel == null || activeModel.getTop5Accuracy() == null
                        ? null : activeModel.getTop5Accuracy().doubleValue())
                .build();
    }

    @Transactional(readOnly = true)
    public StoreAnalyticsResponse getStoreAnalytics(Long storeUserId, LocalDate fromDate, LocalDate toDate) {
        LocalDate safeTo = toDate == null ? LocalDate.now() : toDate;
        LocalDate safeFrom = fromDate == null ? safeTo.minusDays(29) : fromDate;
        if (safeFrom.isAfter(safeTo)) {
            throw new IllegalArgumentException("Ngày bắt đầu không thể sau ngày kết thúc.");
        }
        LocalDateTime from = safeFrom.atStartOfDay();
        LocalDateTime to = safeTo.atTime(LocalTime.MAX);

        List<Product> products = productRepository.findByStore_UserId(storeUserId);
        List<RecommendationItem> recommendationItems = itemRepository
                .findByProduct_Store_UserIdAndHistory_CreatedAtBetween(storeUserId, from, to);
        List<Favorite> favorites = favoriteRepository
                .findByProduct_Store_UserIdAndCreatedAtBetween(storeUserId, from, to);
        List<RecommendationFeedback> selectedFeedback = feedbackRepository
                .findBySelectedProduct_Store_UserIdAndUpdatedAtBetween(storeUserId, from, to);

        Map<Long, Long> appearances = recommendationItems.stream().collect(Collectors.groupingBy(
                item -> item.getProduct().getProductId(), Collectors.counting()));
        Map<Long, Long> favoriteCounts = favorites.stream().collect(Collectors.groupingBy(
                favorite -> favorite.getProduct().getProductId(), Collectors.counting()));
        Map<Long, List<RecommendationFeedback>> feedbackByProduct = selectedFeedback.stream()
                .collect(Collectors.groupingBy(feedback -> feedback.getSelectedProduct().getProductId()));

        List<StoreAnalyticsResponse.ProductMetric> metrics = products.stream()
                .map(product -> {
                    List<RecommendationFeedback> productFeedback = feedbackByProduct
                            .getOrDefault(product.getProductId(), List.of());
                    return StoreAnalyticsResponse.ProductMetric.builder()
                            .productId(product.getProductId())
                            .name(product.getName())
                            .imageUrl(product.getImageUrl())
                            .status(product.getStatus())
                            .businessStatus(product.getBusinessStatus())
                            .appearances(appearances.getOrDefault(product.getProductId(), 0L))
                            .views(product.getViewCount() == null ? 0 : product.getViewCount())
                            .favorites(favoriteCounts.getOrDefault(product.getProductId(), 0L))
                            .selections(productFeedback.size())
                            .averageRating(averageRating(productFeedback))
                            .build();
                })
                .sorted(Comparator.comparingLong(StoreAnalyticsResponse.ProductMetric::getAppearances).reversed())
                .toList();

        return StoreAnalyticsResponse.builder()
                .from(safeFrom).to(safeTo)
                .totalProducts(products.size())
                .totalAppearances(recommendationItems.size())
                .totalViews(products.stream().mapToLong(product -> product.getViewCount() == null ? 0 : product.getViewCount()).sum())
                .totalFavorites(favorites.size())
                .totalSelections(selectedFeedback.size())
                .averageRating(averageRating(selectedFeedback))
                .products(metrics)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminAiFeedbackResponse getAiFeedback() {
        List<RecommendationFeedback> all = feedbackRepository.findAll();
        Map<String, List<RecommendationFeedback>> byModel = all.stream().collect(Collectors.groupingBy(
                feedback -> Optional.ofNullable(feedback.getHistory().getModelVersion()).orElse("UNKNOWN"),
                LinkedHashMap::new,
                Collectors.toList()
        ));
        List<AdminAiFeedbackResponse.ModelMetric> models = byModel.entrySet().stream()
                .map(entry -> toModelMetric(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingLong(AdminAiFeedbackResponse.ModelMetric::getFeedbackCount).reversed())
                .toList();
        return AdminAiFeedbackResponse.builder()
                .totalFeedback(all.size())
                .averageRating(averageRating(all))
                .relevantRate(rate(all, feedback -> Boolean.TRUE.equals(feedback.getIsRelevant())))
                .selectionRate(rate(all, feedback -> feedback.getSelectedProduct() != null))
                .models(models)
                .build();
    }

    @Transactional(readOnly = true)
    public DataQualityResponse getDataQuality() {
        List<Product> products = productRepository.findAll();
        List<DataQualityResponse.ProductIssue> issues = new ArrayList<>();
        long missingImage = 0;
        long missingDescription = 0;
        long missingLabel = 0;
        long invalidPrice = 0;
        for (Product product : products) {
            List<String> productIssues = new ArrayList<>();
            if (product.getImageUrl() == null || product.getImageUrl().isBlank()) {
                missingImage++;
                productIssues.add("Thiếu hình ảnh");
            }
            if (product.getDescription() == null || product.getDescription().isBlank()) {
                missingDescription++;
                productIssues.add("Thiếu mô tả");
            }
            if (product.getGiftLabel() == null || product.getAiGiftName() == null || product.getAiGiftName().isBlank()) {
                missingLabel++;
                productIssues.add("Thiếu nhãn AI");
            }
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                invalidPrice++;
                productIssues.add("Giá không hợp lệ");
            }
            if (!productIssues.isEmpty()) {
                issues.add(DataQualityResponse.ProductIssue.builder()
                        .productId(product.getProductId()).name(product.getName()).issues(productIssues).build());
            }
        }

        Set<String> activeLabels = giftLabelRepository.findByIsActiveTrueOrderByGiftType_DisplayNameAscDisplayNameAsc()
                .stream().map(GiftLabel::getDisplayName).collect(Collectors.toSet());
        List<String> unmapped = predictionRepository.findDistinctGiftNames().stream()
                .filter(name -> !activeLabels.contains(name))
                .sorted().toList();

        return DataQualityResponse.builder()
                .productsMissingImage(missingImage)
                .productsMissingDescription(missingDescription)
                .productsMissingGiftLabel(missingLabel)
                .productsWithInvalidPrice(invalidPrice)
                .unmappedPredictionLabels(unmapped.size())
                .productIssues(issues.stream().limit(100).toList())
                .unmappedLabels(unmapped)
                .build();
    }

    @Transactional(readOnly = true)
    public String exportValidatedFeedbackCsv() {
        StringBuilder csv = new StringBuilder("history_id,model_version,gender,relationship,occasion,budget,interests,personality,age_group,closeness,gift_style,rating,is_relevant,selected_product_id,selected_gift_type,selected_gift_label,created_at\r\n");
        feedbackRepository.findAll().stream()
                .filter(feedback -> feedback.getRating() != null
                        && feedback.getRating() >= 1
                        && feedback.getRating() <= 5)
                .sorted(Comparator.comparing(RecommendationFeedback::getCreatedAt))
                .forEach(feedback -> {
                    RecommendationHistory history = feedback.getHistory();
                    Product selectedProduct = feedback.getSelectedProduct();
                    appendCsvRow(csv,
                            history.getHistoryId(), history.getModelVersion(), history.getGender(),
                            history.getRelationshipToReceiver(), history.getOccasion(), history.getBudget(),
                            history.getInterests(), history.getReceiverPersonality(), history.getReceiverAgeGroup(),
                            history.getRelationshipCloseness(), history.getGiverPreferenceStyle(), feedback.getRating(),
                            feedback.getIsRelevant(), selectedProduct == null ? null : selectedProduct.getProductId(),
                            selectedProduct == null ? null : selectedProduct.getGiftType(),
                            selectedProduct == null ? null : selectedProduct.getAiGiftName(), feedback.getCreatedAt());
                });
        return csv.toString();
    }

    private void appendCsvRow(StringBuilder csv, Object... values) {
        for (int index = 0; index < values.length; index++) {
            if (index > 0) csv.append(',');
            String value = values[index] == null ? "" : values[index].toString();
            csv.append('"').append(value.replace("\"", "\"\"")).append('"');
        }
        csv.append("\r\n");
    }

    private AdminAiFeedbackResponse.ModelMetric toModelMetric(String version, List<RecommendationFeedback> feedback) {
        return AdminAiFeedbackResponse.ModelMetric.builder()
                .modelVersion(version)
                .feedbackCount(feedback.size())
                .averageRating(averageRating(feedback))
                .relevantRate(rate(feedback, item -> Boolean.TRUE.equals(item.getIsRelevant())))
                .selectionRate(rate(feedback, item -> item.getSelectedProduct() != null))
                .build();
    }

    private Double averageRating(List<RecommendationFeedback> feedback) {
        return feedback.isEmpty() ? null : feedback.stream().mapToInt(RecommendationFeedback::getRating).average().orElse(0);
    }

    private Double rate(List<RecommendationFeedback> feedback, Function<RecommendationFeedback, Boolean> predicate) {
        if (feedback.isEmpty()) return null;
        return feedback.stream().filter(item -> Boolean.TRUE.equals(predicate.apply(item))).count() * 100.0 / feedback.size();
    }
}
