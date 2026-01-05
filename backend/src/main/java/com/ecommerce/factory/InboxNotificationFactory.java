package com.ecommerce.factory;

import com.ecommerce.repository.InboxNotificationRepository;

public class InboxNotificationFactory implements NotificationFactory {

    private final InboxNotificationRepository repo;

    public InboxNotificationFactory(InboxNotificationRepository repo) {
        this.repo = repo;
    }

    @Override
    public Notification createNotification() {
        return new InboxNotificationSender(repo);
    }
}