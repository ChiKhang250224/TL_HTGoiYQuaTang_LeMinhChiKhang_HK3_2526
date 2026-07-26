package com.giftmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recommendation_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private RecipientProfile recipientProfile;

    @Column(length = 100)
    private String recipientName;

    @Column(length = 30)
    private String gender;

    @Column(length = 80)
    private String relationshipToReceiver;

    @Column(length = 100)
    private String occasion;

    @Column(precision = 12, scale = 2)
    private BigDecimal budget;

    @Column(length = 150)
    private String interests;

    @Column(length = 100)
    private String receiverPersonality;

    @Column(length = 50)
    private String receiverAgeGroup;

    @Column(length = 50)
    private String relationshipCloseness;

    @Column(length = 100)
    private String giverPreferenceStyle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private AiModel model;

    @Column(length = 100)
    private String modelVersion;

    @Column(columnDefinition = "TEXT")
    private String aiInsights;

    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rankPosition ASC")
    @Builder.Default
    private List<RecommendationPrediction> predictions = new ArrayList<>();

    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rankPosition ASC")
    @Builder.Default
    private List<RecommendationItem> recommendationItems = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public void addPrediction(RecommendationPrediction prediction) {
        predictions.add(prediction);
        prediction.setHistory(this);
    }

    public void addRecommendationItem(RecommendationItem item) {
        recommendationItems.add(item);
        item.setHistory(this);
    }
}
