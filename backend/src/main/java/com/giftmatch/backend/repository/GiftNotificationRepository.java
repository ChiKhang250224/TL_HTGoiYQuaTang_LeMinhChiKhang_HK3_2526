package com.giftmatch.backend.repository;

import com.giftmatch.backend.entity.GiftNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GiftNotificationRepository
        extends JpaRepository<GiftNotification, Long> {

    List<GiftNotification> findByUser_UserIdOrderByEventDateAscCreatedAtDesc(
            Long userId
    );

    Optional<GiftNotification> findByNotificationIdAndUser_UserId(
            Long notificationId,
            Long userId
    );

    boolean existsByUser_UserIdAndProfile_ProfileIdAndEventDateAndEventName(
            Long userId,
            Long profileId,
            LocalDate eventDate,
            String eventName
    );

    long countByUser_UserIdAndIsReadFalseAndEventDateGreaterThanEqual(
            Long userId,
            LocalDate eventDate
    );
}
