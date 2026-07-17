package com.giftmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "recipient_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipientProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column
    private Integer age;

    @Column(length = 20)
    private String gender;

    @Column(length = 50)
    private String relationship;

    @ElementCollection
    @CollectionTable(name = "profile_hobbies", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "hobby")
    private List<String> hobbies;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ElementCollection
    @CollectionTable(name = "profile_anniversaries", joinColumns = @JoinColumn(name = "profile_id"))
    private List<Anniversary> anniversaries;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
