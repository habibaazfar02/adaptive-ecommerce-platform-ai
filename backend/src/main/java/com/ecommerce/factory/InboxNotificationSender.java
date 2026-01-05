package com.ecommerce.factory;

import com.ecommerce.model.InboxNotification;
import com.ecommerce.repository.InboxNotificationRepository;

public class InboxNotificationSender implements Notification {

    private final InboxNotificationRepository repo;

    public InboxNotificationSender(InboxNotificationRepository repo) {
        this.repo = repo;
    }

    @Override
    public void send(Long userId, String message) {
        InboxNotification notification = new InboxNotification();
        notification.setUserId(userId);
        notification.setMessage(message);

        repo.save(notification);
    }
}