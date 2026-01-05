package com.ecommerce.decorator;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

public class ProductDecoratorTest {

    @Test
    void testLowStockDecorator() {
        ProductView view = new ProductView();
        view.stock = 5;
        view.badges = new ArrayList<>();

        LowStockBadgeDecorator decorator = new LowStockBadgeDecorator();
        decorator.apply(view);

        assertTrue(view.badges.contains("LOW STOCK"));
    }

    @Test
    void testDiscountBadgeDecorator() {
        ProductView view = new ProductView();
        view.basePrice = new BigDecimal("100.00");
        view.price = new BigDecimal("80.00"); // Lower than base
        view.badges = new ArrayList<>();

        DiscountBadgeDecorator decorator = new DiscountBadgeDecorator();
        decorator.apply(view);

        assertTrue(view.badges.stream().anyMatch(b -> b.contains("MEGA DEAL")));
    }
}