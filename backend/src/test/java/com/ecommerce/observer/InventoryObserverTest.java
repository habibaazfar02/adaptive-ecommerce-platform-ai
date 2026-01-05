package com.ecommerce.observer;

import com.ecommerce.model.Product;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

public class InventoryObserverTest {

    @Test
    void testPriceSlashOnHighStock() {
        // Arrange
        InventoryManager manager = new InventoryManager();
        PriceManager priceManager = new PriceManager();
        manager.attach(priceManager);

        Product product = new Product();
        product.setName("Test Laptop");
        product.setBasePrice(new BigDecimal("1000.00"));
        product.setCurrentPrice(new BigDecimal("1000.00"));
        product.setStock(60); // Trigger threshold is > 50

        // Act
        manager.notifyAllObservers(product);

        // Assert: 20% discount should be applied (1000 * 0.8 = 800)
        assertEquals(0, new BigDecimal("800.00").compareTo(product.getCurrentPrice()));
    }
}