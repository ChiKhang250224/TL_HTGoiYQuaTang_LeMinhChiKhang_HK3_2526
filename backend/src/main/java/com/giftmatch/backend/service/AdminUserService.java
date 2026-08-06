package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AdminUserResponse;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> search(String keyword, String role, Boolean active) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        String normalizedRole = role == null ? "" : role.trim().toUpperCase(Locale.ROOT);
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .filter(user -> normalizedKeyword.isBlank()
                        || user.getFullName().toLowerCase(Locale.ROOT).contains(normalizedKeyword)
                        || user.getEmail().toLowerCase(Locale.ROOT).contains(normalizedKeyword))
                .filter(user -> normalizedRole.isBlank() || user.getRole().name().equals(normalizedRole))
                .filter(user -> active == null || user.getIsActive().equals(active))
                .map(AdminUserResponse::from)
                .toList();
    }

    @Transactional
    public AdminUserResponse setActive(Long userId, boolean active, User actor) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));
        if (target.getUserId().equals(actor.getUserId()) && !active) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Không thể khóa tài khoản quản trị đang đăng nhập."
            );
        }
        if (target.getRole() == Role.ADMIN && !active) {
            long activeAdmins = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.ADMIN && Boolean.TRUE.equals(user.getIsActive()))
                    .count();
            if (activeAdmins <= 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hệ thống phải còn ít nhất một Admin hoạt động.");
            }
        }
        target.setIsActive(active);
        User saved = userRepository.save(target);
        auditLogService.record(
                actor,
                active ? "USER_UNLOCKED" : "USER_LOCKED",
                "USER",
                target.getUserId(),
                (active ? "Mở khóa" : "Khóa") + " tài khoản " + target.getEmail()
        );
        return AdminUserResponse.from(saved);
    }
}
