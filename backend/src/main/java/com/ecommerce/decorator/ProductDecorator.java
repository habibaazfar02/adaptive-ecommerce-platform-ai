package com.ecommerce.decorator;

public interface ProductDecorator {
  ProductView apply(ProductView view);
  String name();
}