package com.ecommerce.service;

import com.ecommerce.dto.OrderRequestDTO;
import com.ecommerce.factory.InboxNotificationFactory;
import com.ecommerce.factory.Notification;
import com.ecommerce.factory.NotificationFactory;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.InboxNotificationRepository; // 👈 Import added
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InboxNotificationRepository inboxRepo; // 👈 1. Added repository

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        InboxNotificationRepository inboxRepo) { // 👈 2. Inject repository
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.inboxRepo = inboxRepo;
    }

    @Transactional
    public Order createOrder(OrderRequestDTO dto) {
        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setStatus("PLACED");

        double total = 0;

        for (OrderRequestDTO.ItemDTO i : dto.getItems()) {
            Product product = productRepository.findById(i.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            double price = product.getCurrentPrice().doubleValue();

            if (product.getStock() < i.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }

            product.setStock(product.getStock() - i.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setQuantity(i.getQuantity());
            item.setPrice(price);

            order.addItem(item);
            total += price * i.getQuantity();
        }

        order.setTotal(total);
        Order savedOrder = orderRepository.save(order);

        // ✅ 3. TRIGGER FACTORY METHOD NOTIFICATION
        NotificationFactory factory = new InboxNotificationFactory(inboxRepo);
        Notification sender = factory.createNotification();
        
        String message = "Your order #" + savedOrder.getId() + " for Rs " + total + " has been placed successfully!";
        sender.send(savedOrder.getUserId(), message);

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}