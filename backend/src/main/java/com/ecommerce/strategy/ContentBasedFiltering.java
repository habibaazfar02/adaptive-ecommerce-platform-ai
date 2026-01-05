package com.ecommerce.strategy;

import com.ecommerce.model.Product;
import java.util.*;
import java.util.stream.Collectors;

public class ContentBasedFiltering implements RecommendationStrategy {
  @Override public String name(){ return "ContentBasedFiltering"; }

  @Override
  public List<Product> recommend(Long userId, List<Product> allProducts) {
    // Demo: prefer Electronics + in-stock items
    return allProducts.stream()
      .filter(p -> p.getStock() > 0)
      .sorted(Comparator.comparing((Product p) -> "Electronics".equalsIgnoreCase(p.getCategory()) ? 0 : 1))
      .limit(6)
      .collect(Collectors.toList());
  }
}