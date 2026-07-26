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

import java.time.LocalDateTime;

@Entity
@Table(name = "gift_labels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiftLabel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long giftLabelId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gift_type_id", nullable = false)
    private GiftType giftType;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(nullable = false, unique = true, length = 120)
    private String displayName;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
