package com.ecommerce.strategy;
import com.ecommerce.model.Product;
import java.util.*;
import java.util.stream.Collectors;

public class CollaborativeFiltering implements RecommendationStrategy {
    @Override public String name() { return "CollaborativeFiltering"; }
    @Override
    public List<Product> recommend(Long userId, List<Product> allProducts) {
        // AI Logic: Sorts by "Popularity" (Simulated by stock turnover)
        return allProducts.stream()
            .filter(p -> p.getStock() > 0)
            .sorted(Comparator.comparingInt(Product::getStock))
            .limit(6)
            .collect(Collectors.toList());
    }
}