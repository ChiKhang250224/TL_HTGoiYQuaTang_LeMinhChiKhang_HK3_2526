package com.giftmatch.backend.service;

import com.giftmatch.backend.dto.GiftNotificationResponse;
import com.giftmatch.backend.entity.Anniversary;
import com.giftmatch.backend.entity.GiftNotification;
import com.giftmatch.backend.entity.RecipientProfile;
import com.giftmatch.backend.entity.User;
import com.giftmatch.backend.entity.Role;
import com.giftmatch.backend.repository.GiftNotificationRepository;
import com.giftmatch.backend.repository.RecipientProfileRepository;
import com.giftmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.MonthDay;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GiftNotificationService {
    private static final int REMINDER_WINDOW_DAYS = 30;

    private final GiftNotificationRepository notificationRepository;
    private final RecipientProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<GiftNotificationResponse> getNotifications(Long userId) {
        generateUpcomingNotifications(userId);
        LocalDate today = LocalDate.now();
        return notificationRepository
                .findByUser_UserIdOrderByEventDateAscCreatedAtDesc(userId)
                .stream()
                .filter(notification ->
                        !notification.getEventDate().isBefore(today))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public long getUnreadCount(Long userId) {
        generateUpcomingNotifications(userId);
        return notificationRepository
                .countByUser_UserIdAndIsReadFalseAndEventDateGreaterThanEqual(
                        userId,
                        LocalDate.now()
                );
    }

    @Transactional
    public GiftNotificationResponse markRead(
            Long notificationId,
            Long userId
    ) {
        GiftNotification notification = notificationRepository
                .findByNotificationIdAndUser_UserId(notificationId, userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thông báo của người dùng hiện tại."
                ));
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllRead(Long userId) {
        List<GiftNotification> notifications = notificationRepository
                .findByUser_UserIdOrderByEventDateAscCreatedAtDesc(userId);
        LocalDateTime now = LocalDateTime.now();
        notifications.stream()
                .filter(notification -> !Boolean.TRUE.equals(
                        notification.getIsRead()
                ))
                .forEach(notification -> {
                    notification.setIsRead(true);
                    notification.setReadAt(now);
                });
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void generateForAllActiveCustomers() {
        userRepository.findByRoleAndIsActiveTrue(Role.CUSTOMER)
                .forEach(user -> generateUpcomingNotifications(user.getUserId()));
    }

    private void generateUpcomingNotifications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate today = LocalDate.now();

        for (RecipientProfile profile
                : profileRepository.findByUser_UserId(userId)) {
            if (profile.getAnniversaries() == null) {
                continue;
            }
            for (Anniversary anniversary : profile.getAnniversaries()) {
                if (anniversary.getEventDate() == null) {
                    continue;
                }

                LocalDate occurrence = nextOccurrence(
                        anniversary.getEventDate(),
                        today
                );
                long days = ChronoUnit.DAYS.between(today, occurrence);
                if (days < 0 || days > REMINDER_WINDOW_DAYS) {
                    continue;
                }

                String eventName = anniversary.getEventName() == null
                        || anniversary.getEventName().isBlank()
                        ? "ngày kỷ niệm"
                        : anniversary.getEventName().trim();
                eventName = truncate(eventName, 100);
                String title = truncate(
                        "Sắp đến " + eventName
                                + " của " + profile.getFullName(),
                        200
                );

                boolean exists = notificationRepository
                        .existsByUser_UserIdAndProfile_ProfileIdAndEventDateAndEventName(
                                userId,
                                profile.getProfileId(),
                                occurrence,
                                eventName
                        );
                if (exists) {
                    continue;
                }

                String timeText = days == 0
                        ? "Hôm nay"
                        : "Còn " + days + " ngày";
                notificationRepository.save(GiftNotification.builder()
                        .user(user)
                        .profile(profile)
                        .eventName(eventName)
                        .title(title)
                        .message(timeText
                                + ". Hãy chọn một món quà phù hợp cho "
                                + profile.getFullName() + ".")
                        .eventDate(occurrence)
                        .remindAt(today.atStartOfDay())
                        .isRead(false)
                        .build());
            }
        }
    }

    private LocalDate nextOccurrence(LocalDate source, LocalDate today) {
        MonthDay monthDay = MonthDay.from(source);
        LocalDate occurrence = monthDay.atYear(today.getYear());
        if (occurrence.isBefore(today)) {
            occurrence = monthDay.atYear(today.getYear() + 1);
        }
        return occurrence;
    }

    private String truncate(String value, int maxLength) {
        return value.length() <= maxLength
                ? value
                : value.substring(0, maxLength);
    }

    private GiftNotificationResponse toResponse(
            GiftNotification notification
    ) {
        RecipientProfile profile = notification.getProfile();

        return GiftNotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .profileId(profile == null ? null : profile.getProfileId())
                .recipientName(profile == null
                        ? null
                        : profile.getFullName())
                .eventName(notification.getEventName())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .eventDate(notification.getEventDate())
                .daysRemaining(Math.max(
                        0,
                        ChronoUnit.DAYS.between(
                                LocalDate.now(),
                                notification.getEventDate()
                        )
                ))
                .read(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
