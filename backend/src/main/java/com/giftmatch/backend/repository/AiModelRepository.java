package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.AiModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiModelRepository extends JpaRepository<AiModel, Long> {
    Optional<AiModel> findByModelVersion(String modelVersion);

    Optional<AiModel> findFirstByStatusOrderByActivatedAtDesc(String status);
}
