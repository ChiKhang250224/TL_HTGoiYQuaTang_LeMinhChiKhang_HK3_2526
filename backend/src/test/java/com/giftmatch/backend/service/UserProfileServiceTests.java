package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.ChangePasswordRequest;
import com.giftmatch.backend.dto.UpdateUserProfileRequest;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTests {
    @Mock UserRepository repository;
    @Mock PasswordEncoder encoder;
    @InjectMocks UserProfileService service;

    @Test
    void updatesOnlyEditableProfileFields() {
        User user = User.builder().userId(1L).email("user@gift.vn").fullName("Cu").role(Role.CUSTOMER).build();
        UpdateUserProfileRequest request = new UpdateUserProfileRequest();
        request.setFullName("Nguyen Van A"); request.setPhoneNumber("0901"); request.setAvatarUrl("https://img");
        when(repository.findById(1L)).thenReturn(Optional.of(user));
        when(repository.save(user)).thenReturn(user);

        var result = service.update(user, request);
        assertThat(result.getFullName()).isEqualTo("Nguyen Van A");
        assertThat(result.getEmail()).isEqualTo("user@gift.vn");
    }

    @Test
    void rejectsIncorrectCurrentPassword() {
        User user = User.builder().userId(1L).passwordHash("hash").build();
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrong"); request.setNewPassword("NewPass123");
        when(repository.findById(1L)).thenReturn(Optional.of(user));
        when(encoder.matches("wrong", "hash")).thenReturn(false);

        assertThatThrownBy(() -> service.changePassword(user, request))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("400 BAD_REQUEST");
    }
}
