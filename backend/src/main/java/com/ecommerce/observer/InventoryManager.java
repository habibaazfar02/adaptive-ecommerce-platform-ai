package com.ecommerce.observer;

import com.ecommerce.model.Product;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class InventoryManager implements InventorySubject {
  private final List<Observer> observers = new CopyOnWriteArrayList<>();

  @Override
  public void attach(Observer o) { observers.add(o); }

  @Override
  public void detach(String observerName) {
    observers.removeIf(o -> o.name().equalsIgnoreCase(observerName));
  }

  @Override
  public void notifyAllObservers(Product product) {
    for (Observer o : observers) o.update(product);
  }

  public List<String> listObservers() {
    List<String> names = new ArrayList<>();
    for (Observer o: observers) names.add(o.name());
    return names;
  }
}