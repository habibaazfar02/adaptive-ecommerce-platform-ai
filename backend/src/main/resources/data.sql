-- Trigger for PriceManager (Stock > 50)
INSERT INTO products (name, description, base_price, current_price, stock, category, image_url)
VALUES ('Bulk Smartphone', 'High inventory test', 500.00, 500.00, 55, 'Electronics', 'phone.jpg');

-- Trigger for LowStockDecorator (Stock <= 10)
INSERT INTO products (name, description, base_price, current_price, stock, category, image_url)
VALUES ('Limited Edition Cap', 'Rare item test', 25.00, 25.00, 4, 'Fashion', 'cap.jpg');