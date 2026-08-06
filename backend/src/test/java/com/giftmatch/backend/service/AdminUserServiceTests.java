package com.giftmatch.backend.service;

import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.UserRepository;
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
class AdminUserServiceTests {
    @Mock UserRepository repository;
    @Mock AuditLogService auditLogService;
    @InjectMocks AdminUserService service;

    @Test
    void adminCannotLockCurrentAccount() {
        User admin = user(1L, Role.ADMIN, true);
        when(repository.findById(1L)).thenReturn(Optional.of(admin));
        assertThatThrownBy(() -> service.setActive(1L, false, admin))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
    }

    @Test
    void adminCanLockCustomerAndAuditAction() {
        User admin = user(1L, Role.ADMIN, true);
        User customer = user(2L, Role.CUSTOMER, true);
        when(repository.findById(2L)).thenReturn(Optional.of(customer));
        when(repository.save(customer)).thenReturn(customer);
        var response = service.setActive(2L, false, admin);
        assertThat(response.getActive()).isFalse();
        verify(auditLogService).record(admin, "USER_LOCKED", "USER", 2L, "Khóa tài khoản user2@gift.vn");
    }

    private User user(Long id, Role role, boolean active) {
        return User.builder().userId(id).email("user" + id + "@gift.vn")
                .fullName("User " + id).role(role).isActive(active).build();
    }
}
