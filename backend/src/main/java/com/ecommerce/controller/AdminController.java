package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.Order;
import com.ecommerce.service.ProductService;
import com.ecommerce.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final ProductService productService;
    private final OrderRepository orderRepository;

    private final String UPLOAD_DIR = "uploads/";

    public AdminController(ProductService productService, OrderRepository orderRepository) {
        this.productService = productService;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping(value = "/products", consumes = {"multipart/form-data"})
    public Product addProduct(
            @RequestPart("product") Product product,
            @RequestPart("file") MultipartFile file) throws IOException {

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        product.setImageUrl(fileName);
        return productService.saveProduct(product);
    }

    @PutMapping("/products/{id}/discount")
    public void applyDiscount(@PathVariable Long id, @RequestParam Double percentage) {
        productService.applyManualDiscount(id, percentage);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}