package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.AdminAuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {
    List<AdminAuditLog> findByActionContainingIgnoreCaseAndTargetTypeContainingIgnoreCaseOrderByCreatedAtDesc(
            String action, String targetType, Pageable pageable
    );
}
