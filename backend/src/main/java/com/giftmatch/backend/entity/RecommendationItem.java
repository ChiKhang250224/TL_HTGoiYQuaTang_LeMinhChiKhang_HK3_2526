package com.giftmatch.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendationItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "history_id", nullable = false)
    private RecommendationHistory history;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(length = 120)
    private String predictedGiftName;

    @Column(length = 100)
    private String predictedGiftType;

    @Column(precision = 10, scale = 8)
    private BigDecimal aiScore;

    @Column(precision = 10, scale = 8)
    private BigDecimal matchScore;

    @Column(length = 20)
    private String matchSource;

    @Column(length = 1000)
    private String matchReason;

    @Column(nullable = false)
    private Integer rankPosition;

    @Column(nullable = false)
    @Builder.Default
    private Boolean clicked = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean favorited = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean selected = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
