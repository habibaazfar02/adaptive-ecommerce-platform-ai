package com.ecommerce.service;

import com.ecommerce.decorator.*; // ProductView is inside this package
import com.ecommerce.model.Product;
import com.ecommerce.observer.InventoryManager;
import com.ecommerce.observer.PriceManager;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.strategy.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ProductService
 * Core logic for managing the product catalog and design patterns.
 */
@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final SimpMessagingTemplate ws;

    // Behavioral Pattern: Observer (Manages inventory-driven events)
    private final InventoryManager inventoryManager = new InventoryManager();

    // Behavioral Pattern: Strategy (Swappable Recommendation Algorithms)
    private final RecommendationEngine recEngine =
            new RecommendationEngine(new CollaborativeFiltering());

    // Structural Pattern: Decorator (Enhances UI data with badges/AI tips)
    private final List<ProductDecorator> decorators = List.of(
            new LowStockBadgeDecorator(),
            new DiscountBadgeDecorator(),
            new AIGeneratedDescriptionDecorator()
    );

    public ProductService(ProductRepository productRepo, SimpMessagingTemplate ws) {
        this.productRepo = productRepo;
        this.ws = ws;
        this.inventoryManager.attach(new PriceManager());
    }

    /* --------------------------------------------------
       PRODUCT LISTING & RECOMMENDATIONS
    -------------------------------------------------- */

    public List<Product> allProducts() {
        return productRepo.findAll();
    }

    public List<ProductView> allProductViews() {
        return productRepo.findAll().stream().map(this::decorate).collect(Collectors.toList());
    }

    public List<ProductView> recommend(Long userId) {
        List<Product> pool = productRepo.findAll();
        return recEngine.getRecommendations(userId, pool)
                .stream().map(this::decorate).collect(Collectors.toList());
    }

    public String currentStrategy() {
        return recEngine.currentStrategyName();
    }

    /* --------------------------------------------------
       ADMIN PORTAL LOGIC
    -------------------------------------------------- */

    /**
     * Requirement: Admin can add new products.
     */
    @Transactional
    public Product saveProduct(Product product) {
        Product saved = productRepo.save(product);
        ws.convertAndSend("/topic/inventory", decorate(saved));
        return saved;
    }

    /**
     * Requirement: Admin can apply manual discounts.
     * Uses BigDecimal arithmetic for financial accuracy.
     */
    @Transactional
    public void applyManualDiscount(Long id, Double percentage) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        BigDecimal discountFactor = BigDecimal.valueOf(percentage / 100.0);
        BigDecimal discountAmount = p.getBasePrice().multiply(discountFactor);
        
        p.setCurrentPrice(p.getBasePrice().subtract(discountAmount));
        
        productRepo.save(p);
        inventoryManager.notifyAllObservers(p);
        ws.convertAndSend("/topic/inventory", decorate(p));
    }

    /**
     * Requirement: Admin can delete products from the database.
     * Fixes: Compilation Error "cannot find symbol method deleteProduct"
     */
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepo.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepo.deleteById(id);
        
        // Broadcast deletion signal to any open Admin Portals
        ws.convertAndSend("/topic/inventory", "DELETED:" + id);
    }

    /* --------------------------------------------------
       STOCK MANAGEMENT
    -------------------------------------------------- */

    @Transactional
    public void reduceStock(Long productId, int qty) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int updated = p.getStock() - qty;
        if (updated < 0) throw new RuntimeException("Insufficient stock");

        p.setStock(updated);
        inventoryManager.notifyAllObservers(p);
        productRepo.save(p);
        ws.convertAndSend("/topic/inventory", decorate(p));
    }

    @Transactional
    public ProductView updateStock(Long productId, int newStock) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        p.setStock(newStock);
        inventoryManager.notifyAllObservers(p);
        Product saved = productRepo.save(p);
        ProductView view = decorate(saved);
        ws.convertAndSend("/topic/inventory", view);
        return view;
    }

    /* --------------------------------------------------
       DECORATOR PIPELINE
    -------------------------------------------------- */

    private ProductView decorate(Product p) {
        ProductView v = new ProductView();
        v.id = p.getId();
        v.name = p.getName();
        v.description = p.getDescription();
        v.price = p.getCurrentPrice();
        v.basePrice = p.getBasePrice();
        v.stock = p.getStock();
        v.image_url = p.getImageUrl();
        v.category = p.getCategory();

        for (ProductDecorator d : decorators) {
            v = d.apply(v);
        }
        return v;
    }
}