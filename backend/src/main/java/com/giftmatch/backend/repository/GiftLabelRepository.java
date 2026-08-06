package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.GiftLabel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GiftLabelRepository extends JpaRepository<GiftLabel, Long> {
    @EntityGraph(attributePaths = "giftType")
    Optional<GiftLabel> findByDisplayNameAndIsActiveTrue(String displayName);

    @EntityGraph(attributePaths = "giftType")
    List<GiftLabel> findByIsActiveTrueOrderByGiftType_DisplayNameAscDisplayNameAsc();
    @EntityGraph(attributePaths = "giftType")
    List<GiftLabel> findAllByOrderByGiftType_DisplayNameAscDisplayNameAsc();
    Optional<GiftLabel> findByCode(String code);
    Optional<GiftLabel> findByDisplayNameIgnoreCase(String displayName);
    long countByGiftType_GiftTypeId(Long giftTypeId);
}
