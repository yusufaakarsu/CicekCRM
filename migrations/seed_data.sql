-- Önce tabloları temizle
DELETE FROM orders;
DELETE FROM customers;

-- Müşteriler
INSERT INTO customers (id, name, email, phone, address, city, district, notes, created_at) VALUES
('c1', 'Ayşe Yılmaz', 'ayse@email.com', '5551112233', 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', 'VIP Müşteri', datetime('now', '-30 days')),
('c2', 'Mehmet Demir', 'mehmet@email.com', '5552223344', 'Abide-i Hürriyet Cd.', 'İstanbul', 'Şişli', 'Düğün organizasyonu müşterisi', datetime('now', '-25 days')),
('c3', 'Fatma Kaya', 'fatma@email.com', '5553334455', 'Ataşehir Bulvarı', 'İstanbul', 'Ataşehir', null, datetime('now', '-20 days')),
('c4', 'Ali Öztürk', null, '5554445566', 'Bağlarbaşı Cd.', 'İstanbul', 'Üsküdar', 'Haftalık düzenli sipariş', datetime('now', '-15 days')),
('c5', 'Zeynep Aydın', 'zeynep@email.com', '5555556677', 'İstiklal Caddesi', 'İstanbul', 'Beyoğlu', null, datetime('now', '-10 days')),
('c6', 'Can Yılmaz', 'can@email.com', '5556667788', 'Teşvikiye', 'İstanbul', 'Şişli', 'Ofis teslimatı', datetime('now', '-5 days')),
('c7', 'Elif Çelik', 'elif@email.com', '5557778899', 'Caddebostan', 'İstanbul', 'Kadıköy', null, datetime('now', '-3 days')),
('c8', 'Murat Şahin', null, '5558889900', 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Sabah teslimat tercih ediyor', datetime('now', '-1 day'));

-- Bugün için siparişler
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, delivery_city, delivery_district, recipient_name, recipient_phone, total_amount, payment_status, notes, created_at) VALUES
('o1', 'c1', 'new', datetime('now'), 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 250.00, 'paid', 'Kırmızı güller', datetime('now', '-2 hours')),
('o2', 'c2', 'preparing', datetime('now'), 'Şişli Merkez', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 'pending', null, datetime('now', '-1 hour')),
('o3', 'c3', 'delivering', datetime('now'), 'Ataşehir Bulvarı', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 'paid', 'Öğlen teslimat', datetime('now'));

-- Yarın için siparişler
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, delivery_city, delivery_district, recipient_name, recipient_phone, total_amount, payment_status, notes, created_at) VALUES
('o4', 'c4', 'new', datetime('now', '+1 day'), 'Bağlarbaşı Cd.', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 'pending', 'Sabah teslimat', datetime('now')),
('o5', 'c5', 'new', datetime('now', '+1 day'), 'İstiklal Caddesi', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 'paid', null, datetime('now'));

-- Gelecek hafta için siparişler
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, delivery_city, delivery_district, recipient_name, recipient_phone, total_amount, payment_status, notes, created_at) VALUES
('o6', 'c6', 'new', datetime('now', '+7 days'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 'paid', 'Doğum günü', datetime('now')),
('o7', 'c7', 'new', datetime('now', '+7 days'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 'pending', null, datetime('now'));

-- Geçmiş siparişler
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, delivery_city, delivery_district, recipient_name, recipient_phone, total_amount, payment_status, notes, created_at) VALUES
('o8', 'c8', 'delivered', datetime('now', '-1 day'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 'paid', null, datetime('now', '-1 day')),
('o9', 'c1', 'delivered', datetime('now', '-2 days'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 'paid', null, datetime('now', '-2 days')),
('o10', 'c2', 'delivered', datetime('now', '-3 days'), 'Şişli Merkez', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 'paid', null, datetime('now', '-3 days'));
