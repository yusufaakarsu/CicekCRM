-- Örnek müşteriler
INSERT INTO customers (id, name, email, phone, address, city, district, notes) 
VALUES 
('c1', 'Test Müşteri 1', 'test1@test.com', '5551112233', 'Test Adres 1', 'İstanbul', 'Kadıköy', 'Test Not 1'),
('c2', 'Test Müşteri 2', 'test2@test.com', '5552223344', 'Test Adres 2', 'İstanbul', 'Beşiktaş', NULL);

-- Bugünün siparişleri
INSERT INTO orders (
    id, customer_id, status, 
    delivery_date, delivery_address, delivery_city, delivery_district,
    recipient_name, recipient_phone, recipient_notes,
    total_amount, payment_status
) 
VALUES 
('o1', 'c1', 'new', 
 DATE('now'), 'Teslimat Adres 1', 'İstanbul', 'Kadıköy',
 'Alıcı 1', '5553334455', NULL,
 100.00, 'pending'),
('o2', 'c2', 'preparing', 
 DATE('now'), 'Teslimat Adres 2', 'İstanbul', 'Beşiktaş',
 'Alıcı 2', '5554445566', 'Kapıda ara',
 200.00, 'paid');
