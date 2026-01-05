package com.ecommerce.decorator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductView {
    public Long id;
    public String name;
    public String description;

    public BigDecimal price;      // DISCOUNTED
    public BigDecimal basePrice;  // ORIGINAL

    public int stock;
    public String image_url;
    public String category;

    public List<String> badges = new ArrayList<>();
}