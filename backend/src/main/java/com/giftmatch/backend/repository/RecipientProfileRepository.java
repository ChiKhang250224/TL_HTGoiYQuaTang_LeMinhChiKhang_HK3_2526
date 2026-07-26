package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.RecipientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipientProfileRepository extends JpaRepository<RecipientProfile, Long> {
    List<RecipientProfile> findByUser_UserId(Long userId);
    Optional<RecipientProfile> findByProfileIdAndUser_UserId(Long profileId, Long userId);
}
