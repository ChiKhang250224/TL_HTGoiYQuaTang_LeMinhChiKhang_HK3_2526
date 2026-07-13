package com.giftmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    @Column(nullable = false, unique = true, length = 100)
    private String tagName;

    @Column(nullable = false, length = 50)
    private String category; // Cảm xúc, Dịp lễ, Đối tượng
}
