package com.ecommerce.strategy;

import com.ecommerce.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class RecommendationStrategyTest {

    private List<Product> mockProducts;

    @BeforeEach
    void setup() {
        Product p1 = new Product();
        p1.setId(1L); p1.setName("Laptop"); p1.setCategory("Electronics"); p1.setStock(10);

        Product p2 = new Product();
        p2.setId(2L); p2.setName("Shoes"); p2.setCategory("Fashion"); p2.setStock(100);

        Product p3 = new Product();
        p3.setId(3L); p3.setName("Phone"); p3.setCategory("Electronics"); p3.setStock(5);

        mockProducts = Arrays.asList(p1, p2, p3);
    }

    @Test
    void testCollaborativeFilteringLogic() {
        // Logic: Sorts by stock (lowest stock first = "popular")
        RecommendationStrategy strategy = new CollaborativeFiltering();
        List<Product> result = strategy.recommend(1L, mockProducts);

        assertEquals("Phone", result.get(0).getName(), "Lowest stock (Phone) should be first");
        assertEquals("Shoes", result.get(result.size() - 1).getName(), "Highest stock (Shoes) should be last");
    }

    @Test
    void testContentBasedFilteringLogic() {
        // Logic: Prioritizes 'Electronics' category
        RecommendationStrategy strategy = new ContentBasedFiltering();
        List<Product> result = strategy.recommend(1L, mockProducts);

        assertEquals("Electronics", result.get(0).getCategory(), "Electronics should be at the top");
        assertTrue(result.get(0).getName().equals("Laptop") || result.get(0).getName().equals("Phone"));
    }
}