-- Önce tabloları temizle
DELETE FROM purchase_order_items;
DELETE FROM purchase_orders;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM product_categories;
DELETE FROM customers;
DELETE FROM suppliers;

-- Ürün Kategorileri
INSERT INTO product_categories (id, name, description) VALUES
('cat1', 'Buketler', 'Hazır buket çeşitleri'),
('cat2', 'Saksı Çiçekleri', 'İç mekan bitkileri'),
('cat3', 'Orkideler', 'Orkide çeşitleri'),
('cat4', 'Aranjmanlar', 'Özel tasarım aranjmanlar'),
('cat5', 'Kutuda Çiçekler', 'Özel kutu tasarımları');

-- Ürünler
INSERT INTO products (id, category_id, name, description, purchase_price, retail_price, wholesale_price, stock) VALUES
('p1', 'cat1', 'Kırmızı Gül Buketi', '12 adet kırmızı gül', 150.00, 250.00, 200.00, 20),
('p2', 'cat1', 'Karışık Mevsim Buketi', 'Mevsim çiçekleri', 100.00, 180.00, 150.00, 15),
('p3', 'cat2', 'Benjamin', 'İç mekan bitkisi', 80.00, 150.00, 120.00, 10),
('p4', 'cat3', 'Mor Orkide', 'Çift dallı mor orkide', 200.00, 350.00, 300.00, 8),
('p5', 'cat4', 'Lüks Aranjman', 'Özel tasarım', 250.00, 450.00, 400.00, 5),
('p6', 'cat5', 'Kutuda Güller', 'Özel kutu tasarımı', 180.00, 300.00, 250.00, 12);

-- Tedarikçiler
INSERT INTO suppliers (id, name, contact_name, phone, email, address, tax_number) VALUES
('s1', 'Çiçek Bahçesi', 'Ahmet Yıldız', '5301112233', 'ahmet@cicekbahcesi.com', 'Yalova', '1234567890'),
('s2', 'Flora Dünyası', 'Ayşe Demir', '5302223344', 'ayse@flora.com', 'Antalya', '2345678901'),
('s3', 'Yeşil Sera', 'Mehmet Kaya', '5303334455', 'mehmet@yesilsera.com', 'İzmir', '3456789012');

-- Müşteriler (Genişletilmiş)
INSERT INTO customers (id, name, email, phone, address, city, district, notes, customer_type, company_name) VALUES
('c1', 'Ayşe Yılmaz', 'ayse@email.com', '5551112233', 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', 'VIP Müşteri', 'retail', null),
('c2', 'Mehmet Demir', 'mehmet@email.com', '5552223344', 'Abide-i Hürriyet Cd.', 'İstanbul', 'Şişli', 'Düğün organizasyonu müşterisi', 'retail', null),
('c3', 'Fatma Kaya', 'fatma@email.com', '5553334455', 'Ataşehir Bulvarı', 'İstanbul', 'Ataşehir', null, 'retail', null),
('c4', 'Ali Öztürk', null, '5554445566', 'Bağlarbaşı Cd.', 'İstanbul', 'Üsküdar', 'Haftalık düzenli sipariş', 'retail', null),
('c5', 'Zeynep Aydın', 'zeynep@email.com', '5555556677', 'İstiklal Caddesi', 'İstanbul', 'Beyoğlu', null, 'retail', null),
('c6', 'Can Yılmaz', 'can@email.com', '5556667788', 'Teşvikiye', 'İstanbul', 'Şişli', 'Ofis teslimatı', 'corporate', 'Tech A.Ş.'),
('c7', 'Elif Çelik', 'elif@email.com', '5557778899', 'Caddebostan', 'İstanbul', 'Kadıköy', null, 'retail', null),
('c8', 'Murat Şahin', null, '5558889900', 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Sabah teslimat tercih ediyor', 'retail', null),
('c9', 'Deniz Yıldız', 'deniz@firma.com', '5559990011', 'Levent Plaza', 'İstanbul', 'Levent', 'Kurumsal müşteri', 'corporate', 'ABC Holding'),
('c10', 'Selin Arslan', 'selin@email.com', '5550001122', 'Acıbadem', 'İstanbul', 'Kadıköy', null, 'retail', null),
('c11', 'Burak Kaya', 'burak@firma.com', '5551122334', 'Maslak Plaza', 'İstanbul', 'Sarıyer', 'Aylık düzenli sipariş', 'corporate', 'XYZ Şirketi'),
('c12', 'Esra Demir', 'esra@email.com', '5552233445', 'Suadiye', 'İstanbul', 'Kadıköy', null, 'retail', null),
('c13', 'Kemal Yılmaz', 'kemal@email.com', '5553344556', 'Etiler', 'İstanbul', 'Beşiktaş', 'Premium müşteri', 'retail', null),
('c14', 'Ceyda Şahin', 'ceyda@firma.com', '5554455667', 'Kavacık', 'İstanbul', 'Beykoz', null, 'corporate', 'Delta Ltd.'),
('c15', 'Onur Aksoy', 'onur@email.com', '5555566778', 'Maltepe', 'İstanbul', 'Maltepe', null, 'retail', null);

-- Siparişler (Genişletilmiş)
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_time_slot, delivery_address, delivery_city, delivery_district, 
                   recipient_name, recipient_phone, subtotal, delivery_fee, total_amount, payment_status, payment_method) VALUES
-- Bugünün Siparişleri
('o1', 'c1', 'new', datetime('now'), 'morning', 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 230.00, 20.00, 250.00, 'paid', 'credit_card'),
('o2', 'c2', 'preparing', datetime('now'), 'afternoon', 'Şişli Merkez', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 155.00, 20.00, 175.00, 'pending', 'cash'),
('o3', 'c3', 'delivering', datetime('now'), 'evening', 'Ataşehir Bulvarı', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 300.00, 20.00, 320.00, 'paid', 'credit_card'),

-- Yarının Siparişleri
('o4', 'c4', 'new', datetime('now', '+1 day'), 'morning', 'Bağlarbaşı Cd.', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 130.00, 20.00, 150.00, 'pending', 'cash'),
('o5', 'c5', 'new', datetime('now', '+1 day'), 'afternoon', 'İstiklal Caddesi', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 260.00, 20.00, 280.00, 'paid', 'credit_card'),
('o6', 'c6', 'new', datetime('now', '+1 day'), 'morning', 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 400.00, 20.00, 420.00, 'paid', 'bank_transfer'),

-- Gelecek Hafta
('o7', 'c7', 'new', datetime('now', '+7 days'), 'afternoon', 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 170.00, 20.00, 190.00, 'pending', 'cash'),
('o8', 'c8', 'new', datetime('now', '+7 days'), 'morning', 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 205.00, 20.00, 225.00, 'paid', 'credit_card'),
('o9', 'c9', 'new', datetime('now', '+7 days'), 'afternoon', 'Levent Plaza', 'İstanbul', 'Levent', 'Deniz Yıldız', '5559990011', 480.00, 20.00, 500.00, 'paid', 'bank_transfer'),

-- Geçmiş Siparişler
('o10', 'c10', 'delivered', datetime('now', '-1 day'), 'morning', 'Acıbadem', 'İstanbul', 'Kadıköy', 'Selin Arslan', '5550001122', 280.00, 20.00, 300.00, 'paid', 'credit_card'),
('o11', 'c11', 'delivered', datetime('now', '-2 days'), 'afternoon', 'Maslak Plaza', 'İstanbul', 'Sarıyer', 'Burak Kaya', '5551122334', 430.00, 20.00, 450.00, 'paid', 'bank_transfer'),
('o12', 'c12', 'delivered', datetime('now', '-3 days'), 'evening', 'Suadiye', 'İstanbul', 'Kadıköy', 'Esra Demir', '5552233445', 180.00, 20.00, 200.00, 'paid', 'cash'),
('o13', 'c13', 'cancelled', datetime('now', '-4 days'), 'morning', 'Etiler', 'İstanbul', 'Beşiktaş', 'Kemal Yılmaz', '5553344556', 330.00, 20.00, 350.00, 'refunded', 'credit_card'),
('o14', 'c14', 'delivered', datetime('now', '-5 days'), 'afternoon', 'Kavacık', 'İstanbul', 'Beykoz', 'Ceyda Şahin', '5554455667', 580.00, 20.00, 600.00, 'paid', 'bank_transfer'),
('o15', 'c15', 'delivered', datetime('now', '-6 days'), 'evening', 'Maltepe', 'İstanbul', 'Maltepe', 'Onur Aksoy', '5555566778', 230.00, 20.00, 250.00, 'paid', 'cash');

-- Sipariş Detayları
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, cost_price) VALUES
('oi1', 'o1', 'p1', 1, 250.00, 150.00),
('oi2', 'o2', 'p2', 1, 180.00, 100.00),
('oi3', 'o3', 'p4', 1, 350.00, 200.00),
('oi4', 'o4', 'p3', 1, 150.00, 80.00),
('oi5', 'o5', 'p5', 1, 450.00, 250.00),
('oi6', 'o6', 'p6', 2, 300.00, 180.00),
('oi7', 'o7', 'p2', 1, 180.00, 100.00),
('oi8', 'o8', 'p1', 1, 250.00, 150.00),
('oi9', 'o9', 'p5', 1, 450.00, 250.00),
('oi10', 'o10', 'p4', 1, 350.00, 200.00);

-- Tedarikçi Siparişleri
INSERT INTO purchase_orders (id, supplier_id, status, total_amount, payment_status, created_at) VALUES
('po1', 's1', 'received', 2000.00, 'paid', datetime('now', '-10 days')),
('po2', 's2', 'ordered', 1500.00, 'pending', datetime('now', '-5 days')),
('po3', 's3', 'draft', 3000.00, 'pending', datetime('now'));

-- Tedarikçi Sipariş Detayları
INSERT INTO purchase_order_items (id, purchase_order_id, product_id, quantity, unit_price, total_price) VALUES
('poi1', 'po1', 'p1', 20, 100.00, 2000.00),
('poi2', 'po2', 'p2', 15, 100.00, 1500.00),
('poi3', 'po3', 'p4', 10, 300.00, 3000.00);
