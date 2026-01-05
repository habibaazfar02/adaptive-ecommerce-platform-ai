package com.ecommerce.factory;

import com.ecommerce.model.InboxNotification;
import com.ecommerce.repository.InboxNotificationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class NotificationFactoryTest {

    @Autowired
    private InboxNotificationRepository inboxRepo;

    @Test
    void testInboxNotificationFactoryFlow() {
        // 1. Arrange: Use the Factory to create a sender
        NotificationFactory factory = new InboxNotificationFactory(inboxRepo);
        Notification sender = factory.createNotification();

        // 2. Act: Send a notification
        String testMessage = "Factory Test Message";
        sender.send(1L, testMessage);

        // 3. Assert: Check if it was saved in the DB
        List<InboxNotification> notes = inboxRepo.findByUserId(1L);
        boolean found = notes.stream().anyMatch(n -> n.getMessage().equals(testMessage));
        
        assertTrue(found, "The Factory should have persisted the notification to the database");
        System.out.println("✅ Factory Method Pattern Verified");
    }
}