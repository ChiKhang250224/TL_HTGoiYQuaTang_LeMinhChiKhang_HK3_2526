package com.giftmatch.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GiftNotificationScheduler {
    private final GiftNotificationService service;

    @Scheduled(cron = "${app.notifications.cron:0 5 1 * * *}", zone = "${app.notifications.zone:Asia/Ho_Chi_Minh}")
    public void generateUpcomingGiftReminders() {
        service.generateForAllActiveCustomers();
    }
}
