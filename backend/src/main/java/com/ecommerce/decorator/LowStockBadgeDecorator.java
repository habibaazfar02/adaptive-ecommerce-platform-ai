package com.ecommerce.decorator;

public class LowStockBadgeDecorator implements ProductDecorator {
  @Override public String name(){ return "LowStockBadgeDecorator"; }

  @Override
  public ProductView apply(ProductView view) {
    if (view.stock > 0 && view.stock <= 10) view.badges.add("LOW STOCK");
    return view;
  }
}