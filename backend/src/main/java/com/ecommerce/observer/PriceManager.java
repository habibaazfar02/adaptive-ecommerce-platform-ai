package com.ecommerce.observer;
import com.ecommerce.model.Product;
import java.math.BigDecimal;

public class PriceManager implements Observer {
    @Override
    public String name() { return "PriceManager"; }

    @Override
    public void update(Product product) {
        if (product.getStock() > 50) {
            BigDecimal base = product.getBasePrice();
            BigDecimal discountPrice = base.multiply(new BigDecimal("0.80"));
            product.setCurrentPrice(discountPrice);
            System.out.println("✅ [Observer] Price slashed for " + product.getName() + " due to high stock: " + product.getStock());
        } else {
            product.setCurrentPrice(product.getBasePrice());
        }
    }
}