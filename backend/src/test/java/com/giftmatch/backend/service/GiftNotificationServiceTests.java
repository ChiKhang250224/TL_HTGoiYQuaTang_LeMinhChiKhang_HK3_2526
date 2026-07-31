package com.giftmatch.backend.service;

import com.giftmatch.backend.entity.Anniversary;
import com.giftmatch.backend.entity.GiftNotification;
import com.giftmatch.backend.entity.RecipientProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.repository.GiftNotificationRepository;
import com.giftmatch.backend.repository.RecipientProfileRepository;
import com.giftmatch.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GiftNotificationServiceTests {
    @Mock
    private GiftNotificationRepository notificationRepository;

    @Mock
    private RecipientProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GiftNotificationService notificationService;

    @Test
    void createsReminderForAnniversaryWithinThirtyDays() {
        Long userId = 10L;
        User user = User.builder().userId(userId).build();
        RecipientProfile profile = RecipientProfile.builder()
                .profileId(20L)
                .user(user)
                .fullName("Lan")
                .anniversaries(List.of(new Anniversary(
                        "Sinh nhật",
                        LocalDate.now().plusDays(7)
                )))
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(profileRepository.findByUser_UserId(userId))
                .thenReturn(List.of(profile));
        when(notificationRepository
                .existsByUser_UserIdAndProfile_ProfileIdAndEventDateAndEventName(
                        userId,
                        profile.getProfileId(),
                        LocalDate.now().plusDays(7),
                        "Sinh nhật"
                ))
                .thenReturn(false);
        when(notificationRepository.save(any(GiftNotification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(notificationRepository
                .findByUser_UserIdOrderByEventDateAscCreatedAtDesc(userId))
                .thenReturn(List.of());

        notificationService.getNotifications(userId);

        ArgumentCaptor<GiftNotification> captor =
                ArgumentCaptor.forClass(GiftNotification.class);
        verify(notificationRepository).save(captor.capture());
        GiftNotification notification = captor.getValue();
        assertThat(notification.getProfile()).isEqualTo(profile);
        assertThat(notification.getEventName()).isEqualTo("Sinh nhật");
        assertThat(notification.getEventDate())
                .isEqualTo(LocalDate.now().plusDays(7));
        assertThat(notification.getIsRead()).isFalse();
        assertThat(notification.getMessage()).contains("Còn 7 ngày");
    }
}
