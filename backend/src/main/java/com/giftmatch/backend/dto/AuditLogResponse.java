package com.giftmatch.backend.dto;

import com.giftmatch.backend.entity.AdminAuditLog;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {
    private Long auditLogId;
    private Long actorUserId;
    private String actorName;
    private String actorEmail;
    private String action;
    private String targetType;
    private String targetId;
    private String summary;
    private LocalDateTime createdAt;

    public static AuditLogResponse from(AdminAuditLog log) {
        return AuditLogResponse.builder()
                .auditLogId(log.getAuditLogId())
                .actorUserId(log.getActor().getUserId())
                .actorName(log.getActor().getFullName())
                .actorEmail(log.getActor().getEmail())
                .action(log.getAction())
                .targetType(log.getTargetType())
                .targetId(log.getTargetId())
                .summary(log.getSummary())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
