package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.AdminStoreDecisionRequest;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.StoreProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.StoreProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminStoreServiceTests {
    @Mock StoreProfileRepository repository;
    @Mock AuditLogService auditLogService;
    @InjectMocks AdminStoreService service;

    @Test
    void rejectionRequiresReason() {
        StoreProfile profile = store();
        AdminStoreDecisionRequest request = new AdminStoreDecisionRequest();
        request.setStatus("REJECTED");
        when(repository.findById(10L)).thenReturn(Optional.of(profile));
        assertThatThrownBy(() -> service.decide(10L, request, admin()))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400 BAD_REQUEST");
    }

    @Test
    void adminCanApproveStore() {
        StoreProfile profile = store();
        AdminStoreDecisionRequest request = new AdminStoreDecisionRequest();
        request.setStatus("APPROVED"); request.setNote("Hồ sơ hợp lệ");
        when(repository.findById(10L)).thenReturn(Optional.of(profile));
        when(repository.save(profile)).thenReturn(profile);
        var response = service.decide(10L, request, admin());
        assertThat(response.getStatus()).isEqualTo("APPROVED");
        assertThat(profile.getReviewedAt()).isNotNull();
    }

    private User admin() { return User.builder().userId(1L).email("admin@gift.vn").fullName("Admin").role(Role.ADMIN).build(); }
    private StoreProfile store() {
        User owner = User.builder().userId(2L).email("store@gift.vn").fullName("Store Owner").role(Role.STORE).build();
        return StoreProfile.builder().storeId(10L).owner(owner).storeName("Gift Store").status("PENDING").build();
    }
}
