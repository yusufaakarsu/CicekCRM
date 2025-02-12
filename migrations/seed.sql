-- Test müşterileri
INSERT INTO customers (id, name, email, phone, address, notes, created_at, updated_at)
VALUES 
('cust_1', 'Ahmet Yılmaz', 'ahmet@test.com', '5551234567', 'İstanbul', 'VIP Müşteri', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cust_2', 'Ayşe Demir', 'ayse@test.com', '5557654321', 'Ankara', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Test siparişleri
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, recipient_name, recipient_phone, total_amount, payment_status, created_at, updated_at)
VALUES 
('ord_1', 'cust_1', 'new', DATE('now'), 'İstanbul/Kadıköy', 'Mehmet Yılmaz', '5551112233', 250.00, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ord_2', 'cust_2', 'preparing', DATE('now'), 'Ankara/Çankaya', 'Fatma Demir', '5554445566', 180.00, 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
