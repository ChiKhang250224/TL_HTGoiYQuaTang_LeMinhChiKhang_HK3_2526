package com.giftmatch.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "gift_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiftType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long giftTypeId;

    @Column(nullable = false, unique = true, length = 60)
    private String code;

    @Column(nullable = false, unique = true, length = 100)
    private String displayName;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
