package com.giftmatch.backend.controller;

import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.security.UserDetailsImpl;
import com.giftmatch.backend.service.HistoryService;
import com.giftmatch.backend.service.RecipientProfileService;
import com.giftmatch.backend.service.RecommendationFeedbackService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerDataAccessTests {
    @Mock private HistoryService historyService;
    @Mock private RecommendationFeedbackService feedbackService;
    @Mock private RecipientProfileService profileService;
    @InjectMocks private HistoryController historyController;
    @InjectMocks private RecipientProfileController profileController;

    @Test
    void customerCannotReadAnotherCustomersHistory() {
        assertThatThrownBy(() -> historyController.getUserHistory(2L, principal(1L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("403 FORBIDDEN");
    }

    @Test
    void customerCannotReadAnotherCustomersRecipientProfiles() {
        assertThatThrownBy(() -> profileController.getUserProfiles(2L, principal(1L)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("403 FORBIDDEN");
    }

    @Test
    void customerCanReadOwnHistoryAndProfiles() {
        when(historyService.getUserHistory(1L)).thenReturn(List.of());
        when(profileService.getProfilesByUser(1L)).thenReturn(List.of());

        historyController.getUserHistory(1L, principal(1L));
        profileController.getUserProfiles(1L, principal(1L));

        verify(historyService).getUserHistory(1L);
        verify(profileService).getProfilesByUser(1L);
    }

    private UserDetailsImpl principal(Long userId) {
        return new UserDetailsImpl(User.builder()
                .userId(userId)
                .email("customer" + userId + "@giftmatch.test")
                .fullName("Customer " + userId)
                .role(Role.CUSTOMER)
                .isActive(true)
                .build());
    }
}
