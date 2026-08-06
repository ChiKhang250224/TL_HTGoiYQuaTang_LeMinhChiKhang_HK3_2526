package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AdminStoreDecisionRequest;
import com.giftmatch.backend.dto.AdminStoreResponse;
import com.giftmatch.backend.entity.StoreProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.StoreProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminStoreService {
    private final StoreProfileRepository repository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<AdminStoreResponse> search(String status, String keyword) {
        String normalizedStatus = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .filter(profile -> normalizedStatus.isBlank() || profile.getStatus().equals(normalizedStatus))
                .filter(profile -> normalizedKeyword.isBlank()
                        || profile.getStoreName().toLowerCase(Locale.ROOT).contains(normalizedKeyword)
                        || profile.getOwner().getEmail().toLowerCase(Locale.ROOT).contains(normalizedKeyword))
                .map(AdminStoreResponse::from)
                .toList();
    }

    @Transactional
    public AdminStoreResponse decide(Long storeId, AdminStoreDecisionRequest request, User actor) {
        StoreProfile profile = repository.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ cửa hàng."));
        String status = request.getStatus().trim().toUpperCase(Locale.ROOT);
        if ("REJECTED".equals(status) && (request.getNote() == null || request.getNote().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cần nhập lý do từ chối cửa hàng.");
        }
        profile.setStatus(status);
        profile.setReviewNote(request.getNote() == null ? null : request.getNote().trim());
        profile.setReviewedBy(actor);
        profile.setReviewedAt(LocalDateTime.now());
        StoreProfile saved = repository.save(profile);
        auditLogService.record(
                actor,
                "APPROVED".equals(status) ? "STORE_APPROVED" : "STORE_REJECTED",
                "STORE_PROFILE",
                profile.getStoreId(),
                status + " cửa hàng " + profile.getStoreName()
        );
        return AdminStoreResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public void requireApproved(Long ownerUserId) {
        StoreProfile profile = repository.findByOwner_UserId(ownerUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản chưa có hồ sơ cửa hàng."));
        if (!"APPROVED".equals(profile.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Cửa hàng chưa được phê duyệt. Trạng thái hiện tại: " + profile.getStatus()
            );
        }
    }
}
