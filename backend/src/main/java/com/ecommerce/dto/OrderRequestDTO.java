package com.ecommerce.dto;

import java.util.List;

public class OrderRequestDTO {

    private Long userId;
    private String paymentMethod;
    private Double total;
    private List<ItemDTO> items;

    public static class ItemDTO {
        private Long id;
        private Integer quantity;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> items) { this.items = items; }
}
