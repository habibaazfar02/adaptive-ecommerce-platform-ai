package com.ecommerce.repository;

import com.ecommerce.model.InboxNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface InboxNotificationRepository extends JpaRepository<InboxNotification, Long> {

    List<InboxNotification> findByUserId(Long userId);

    List<InboxNotification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // ✅ Use nativeQuery = true to avoid HQL semantic errors
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM inbox_notifications WHERE user_id = :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") Long userId);
}