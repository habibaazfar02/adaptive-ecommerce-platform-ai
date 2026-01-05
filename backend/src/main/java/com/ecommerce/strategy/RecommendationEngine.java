package com.ecommerce.strategy;

import com.ecommerce.model.Product;
import java.util.List;

public class RecommendationEngine {
    private RecommendationStrategy strategy;

    public RecommendationEngine(RecommendationStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(RecommendationStrategy strategy) {
        this.strategy = strategy;
    }

    public String currentStrategyName() {
        return strategy.name();
    }

    public List<Product> getRecommendations(Long userId, List<Product> allProducts) {
        return strategy.recommend(userId, allProducts);
    }
}