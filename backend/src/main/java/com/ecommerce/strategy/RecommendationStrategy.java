package com.ecommerce.strategy;
import com.ecommerce.model.Product;
import java.util.List;

public interface RecommendationStrategy {
    String name();
    List<Product> recommend(Long userId, List<Product> allProducts);
}