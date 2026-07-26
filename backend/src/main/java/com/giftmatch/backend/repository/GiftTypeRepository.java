package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.GiftType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GiftTypeRepository extends JpaRepository<GiftType, Long> {
    Optional<GiftType> findByCode(String code);
}
