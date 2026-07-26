package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.StoreProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreProfileRepository extends JpaRepository<StoreProfile, Long> {
    Optional<StoreProfile> findByOwner_UserId(Long ownerUserId);
}
