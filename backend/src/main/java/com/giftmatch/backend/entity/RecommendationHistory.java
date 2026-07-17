package com.giftmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
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

    @Column(columnDefinition = "TEXT")
    private String aiInsights;

    @ManyToMany
    @JoinTable(
        name = "history_products",
        joinColumns = @JoinColumn(name = "history_id"),
        inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> recommendedProducts;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
