package com.ecommerce.observer;

import com.ecommerce.model.Product;

public interface InventorySubject {
  void attach(Observer o);
  void detach(String observerName);
  void notifyAllObservers(Product product);
}