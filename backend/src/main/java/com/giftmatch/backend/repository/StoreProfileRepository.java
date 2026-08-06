package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.StoreProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface StoreProfileRepository extends JpaRepository<StoreProfile, Long> {
    Optional<StoreProfile> findByOwner_UserId(Long ownerUserId);
    List<StoreProfile> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
