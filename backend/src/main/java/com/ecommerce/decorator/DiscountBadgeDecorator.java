package com.ecommerce.decorator;

public class DiscountBadgeDecorator implements ProductDecorator {

    @Override
    public String name() {
        return "DiscountBadgeDecorator";
    }

    @Override
    public ProductView apply(ProductView view) {
        if (view.price != null &&
            view.basePrice != null &&
            view.price.compareTo(view.basePrice) < 0) {

            view.badges.add("🔥 MEGA DEAL (20% OFF)");
        }
        return view;
    }
}