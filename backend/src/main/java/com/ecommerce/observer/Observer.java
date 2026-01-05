package com.ecommerce.observer;

import com.ecommerce.model.Product;

public interface Observer {
    String name(); // The PriceManager must implement this
    void update(Product product);
}