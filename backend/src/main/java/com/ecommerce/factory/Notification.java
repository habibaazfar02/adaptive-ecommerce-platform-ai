package com.ecommerce.factory;

public interface Notification {
    void send(Long userId, String message);
}