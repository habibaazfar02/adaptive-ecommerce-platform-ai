package com.ecommerce.service;

import com.ecommerce.decorator.ProductView;
import com.ecommerce.strategy.CollaborativeFiltering;
import com.ecommerce.strategy.ContentBasedFiltering;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    void testStrategySwitching() {
        // Test initial strategy (Collaborative)
        List<ProductView> recs1 = productService.recommend(1L);
        assertNotNull(recs1);
        
        // Reflection-style check for current strategy name
        String strategyName = productService.currentStrategy();
        assertTrue(strategyName.contains("Filtering"));
    }

    @Test
    void testDecoratedViews() {
        // Ensures the service converts Product Entities to ProductViews with badges
        List<ProductView> views = productService.allProductViews();
        assertFalse(views.isEmpty());
        // Check if decorators are being applied (e.g., badges list exists)
        assertNotNull(views.get(0).badges);
    }
}