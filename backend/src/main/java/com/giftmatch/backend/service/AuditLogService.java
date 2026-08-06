package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AuditLogResponse;
import com.giftmatch.backend.entity.AdminAuditLog;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AdminAuditLogRepository repository;

    @Transactional
    public void record(User actor, String action, String targetType, Object targetId, String summary) {
        repository.save(AdminAuditLog.builder()
                .actor(actor)
                .action(action)
                .targetType(targetType)
                .targetId(targetId == null ? null : String.valueOf(targetId))
                .summary(summary)
                .build());
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> search(String action, String targetType, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 200));
        return repository
                .findByActionContainingIgnoreCaseAndTargetTypeContainingIgnoreCaseOrderByCreatedAtDesc(
                        action == null ? "" : action.trim(),
                        targetType == null ? "" : targetType.trim(),
                        PageRequest.of(0, safeLimit)
                )
                .stream().map(AuditLogResponse::from).toList();
    }
}
