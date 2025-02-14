-- Verileri sırayla ekleyelim
-- 1. Önce ana tablolar
INSERT INTO customers (id, name, email, phone, address, city, district, notes, created_at) VALUES
('c1', 'Ayşe Yılmaz', 'ayse@email.com', '5551112233', 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', 'VIP Müşteri', datetime('now', '-30 days')),
('c2', 'Mehmet Demir', 'mehmet@email.com', '5552223344', 'Abide-i Hürriyet Cd.', 'İstanbul', 'Şişli', 'Düğün organizasyonu müşterisi', datetime('now', '-25 days')),
('c3', 'Fatma Kaya', 'fatma@email.com', '5553334455', 'Ataşehir Bulvarı', 'İstanbul', 'Ataşehir', null, datetime('now', '-20 days')),
('c4', 'Ali Öztürk', null, '5554445566', 'Bağlarbaşı Cd.', 'İstanbul', 'Üsküdar', 'Haftalık düzenli sipariş', datetime('now', '-15 days')),
('c5', 'Zeynep Aydın', 'zeynep@email.com', '5555556677', 'İstiklal Caddesi', 'İstanbul', 'Beyoğlu', null, datetime('now', '-10 days')),
('c6', 'Can Yılmaz', 'can@email.com', '5556667788', 'Teşvikiye', 'İstanbul', 'Şişli', 'Ofis teslimatı', datetime('now', '-5 days')),
('c7', 'Elif Çelik', 'elif@email.com', '5557778899', 'Caddebostan', 'İstanbul', 'Kadıköy', null, datetime('now', '-3 days')),
('c8', 'Murat Şahin', null, '5558889900', 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Sabah teslimat tercih ediyor', datetime('now', '-1 day'));

INSERT INTO suppliers (id, name, contact_name, phone, email, address, tax_number) VALUES
('s1', 'Çiçek Bahçesi', 'Ahmet Yıldız', '5301112233', 'ahmet@cicekbahcesi.com', 'Yalova', '1234567890'),
('s2', 'Flora Dünyası', 'Ayşe Demir', '5302223344', 'ayse@flora.com', 'Antalya', '2345678901'),
('s3', 'Yeşil Sera', 'Mehmet Kaya', '5303334455', 'mehmet@yesilsera.com', 'İzmir', '3456789012');

INSERT INTO product_categories (id, name, description) VALUES
('cat1', 'Buketler', 'Hazır buket çeşitleri'),
('cat2', 'Saksı Çiçekleri', 'İç mekan bitkileri'),
('cat3', 'Orkideler', 'Orkide çeşitleri'),
('cat4', 'Aranjmanlar', 'Özel tasarım aranjmanlar'),
('cat5', 'Kutuda Çiçekler', 'Özel kutu tasarımları');

-- 2. Sonra bağımlı tablolar
INSERT INTO products (id, category_id, name, description, purchase_price, retail_price, wholesale_price, stock) VALUES
('p1', 'cat1', 'Kırmızı Gül Buketi', '12 adet kırmızı gül', 150.00, 250.00, 200.00, 20),
('p2', 'cat1', 'Karışık Mevsim Buketi', 'Mevsim çiçekleri', 100.00, 180.00, 150.00, 15),
('p3', 'cat2', 'Benjamin', 'İç mekan bitkisi', 80.00, 150.00, 120.00, 10),
('p4', 'cat3', 'Mor Orkide', 'Çift dallı mor orkide', 200.00, 350.00, 300.00, 8),
('p5', 'cat4', 'Lüks Aranjman', 'Özel tasarım', 250.00, 450.00, 400.00, 5),
('p6', 'cat5', 'Kutuda Güller', 'Özel kutu tasarımı', 180.00, 300.00, 250.00, 12);

INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, delivery_city, delivery_district, recipient_name, recipient_phone, subtotal, total_amount, payment_status, notes, created_at) VALUES
-- Bugünün Siparişleri (20 adet)
('o1', 'c1', 'new', datetime('now'), 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 250.00, 250.00, 'paid', 'Kırmızı güller', datetime('now', '-2 hours')),
('o2', 'c2', 'preparing', datetime('now'), 'Şişli Merkez', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'pending', null, datetime('now', '-1 hour')),
('o3', 'c3', 'delivering', datetime('now'), 'Ataşehir Bulvarı', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'paid', 'Öğlen teslimat', datetime('now')),
('o4', 'c4', 'new', datetime('now'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now', '-4 hours')),
('o5', 'c5', 'preparing', datetime('now'), 'Beyoğlu', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 450.00, 450.00, 'paid', null, datetime('now', '-3 hours')),
('o6', 'c6', 'new', datetime('now'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 600.00, 600.00, 'pending', null, datetime('now', '-2 hours')),
('o7', 'c7', 'delivering', datetime('now'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 180.00, 180.00, 'paid', null, datetime('now', '-1 hour')),
('o8', 'c8', 'new', datetime('now'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 250.00, 250.00, 'pending', null, datetime('now')),
('o9', 'c1', 'preparing', datetime('now'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 450.00, 450.00, 'paid', null, datetime('now', '-5 hours')),
('o10', 'c2', 'delivering', datetime('now'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 350.00, 350.00, 'pending', null, datetime('now', '-4 hours')),
('o11', 'c3', 'new', datetime('now'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 350.00, 350.00, 'paid', null, datetime('now', '-3 hours')),
('o12', 'c4', 'preparing', datetime('now'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 350.00, 350.00, 'pending', null, datetime('now', '-2 hours')),
('o13', 'c5', 'new', datetime('now'), 'Beyoğlu', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 350.00, 350.00, 'paid', null, datetime('now', '-1 hour')),
('o14', 'c6', 'delivering', datetime('now'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 350.00, 350.00, 'pending', null, datetime('now')),
('o15', 'c7', 'new', datetime('now'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 350.00, 350.00, 'paid', null, datetime('now', '-6 hours')),
('o16', 'c8', 'preparing', datetime('now'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 350.00, 350.00, 'pending', null, datetime('now', '-5 hours')),
('o17', 'c1', 'new', datetime('now'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 350.00, 350.00, 'paid', null, datetime('now', '-4 hours')),
('o18', 'c2', 'delivering', datetime('now'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 350.00, 350.00, 'pending', null, datetime('now', '-3 hours')),
('o19', 'c3', 'new', datetime('now'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 350.00, 350.00, 'paid', null, datetime('now', '-2 hours')),
('o20', 'c4', 'preparing', datetime('now'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 350.00, 350.00, 'pending', null, datetime('now', '-1 hour')),
('o21', 'c4', 'new', datetime('now'), 'Üsküdar Merkez', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 280.00, 280.00, 'pending', null, datetime('now', '-3 hours')),
('o22', 'c5', 'preparing', datetime('now'), 'Beyoğlu', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 350.00, 350.00, 'paid', null, datetime('now', '-2 hours')),
('o23', 'c6', 'new', datetime('now'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'pending', null, datetime('now', '-1 hour')),
('o24', 'c7', 'delivering', datetime('now'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'paid', null, datetime('now')),
('o25', 'c8', 'new', datetime('now'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'pending', null, datetime('now', '-4 hours')),
('o26', 'c1', 'preparing', datetime('now'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'paid', null, datetime('now', '-3 hours')),
('o27', 'c2', 'new', datetime('now'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'pending', null, datetime('now', '-2 hours')),
('o28', 'c3', 'delivering', datetime('now'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'paid', null, datetime('now', '-1 hour')),
('o29', 'c4', 'new', datetime('now'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now')),
('o30', 'c5', 'preparing', datetime('now'), 'İstiklal', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 280.00, 'paid', null, datetime('now', '-5 hours')),
('o31', 'c6', 'new', datetime('now'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'pending', null, datetime('now', '-4 hours')),
('o32', 'c7', 'delivering', datetime('now'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'paid', null, datetime('now', '-3 hours')),
('o33', 'c8', 'new', datetime('now'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'pending', null, datetime('now', '-2 hours')),
('o34', 'c1', 'preparing', datetime('now'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'paid', null, datetime('now', '-1 hour')),
('o35', 'c2', 'new', datetime('now'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'pending', null, datetime('now')),
('o36', 'c3', 'delivering', datetime('now'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'paid', null, datetime('now', '-6 hours')),
('o37', 'c4', 'new', datetime('now'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now', '-5 hours')),

-- Yarının Siparişleri (15 adet)
('o38', 'c5', 'new', datetime('now', '+1 day'), 'Beyoğlu', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 280.00, 'pending', null, datetime('now')),
('o39', 'c6', 'new', datetime('now', '+1 day'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'paid', null, datetime('now')),
('o40', 'c7', 'new', datetime('now', '+1 day'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'pending', null, datetime('now')),
('o41', 'c8', 'new', datetime('now', '+1 day'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'paid', null, datetime('now')),
('o42', 'c1', 'new', datetime('now', '+1 day'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'pending', null, datetime('now')),
('o43', 'c2', 'new', datetime('now', '+1 day'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'paid', null, datetime('now')),
('o44', 'c3', 'new', datetime('now', '+1 day'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'pending', null, datetime('now')),
('o45', 'c4', 'new', datetime('now', '+1 day'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'paid', null, datetime('now')),
('o46', 'c5', 'new', datetime('now', '+1 day'), 'İstiklal', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 280.00, 'pending', null, datetime('now')),
('o47', 'c6', 'new', datetime('now', '+1 day'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'paid', null, datetime('now')),
('o48', 'c7', 'new', datetime('now', '+1 day'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'pending', null, datetime('now')),
('o49', 'c8', 'new', datetime('now', '+1 day'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'paid', null, datetime('now')),
('o50', 'c1', 'new', datetime('now', '+1 day'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'pending', null, datetime('now')),
('o51', 'c2', 'new', datetime('now', '+1 day'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'paid', null, datetime('now')),
('o52', 'c3', 'new', datetime('now', '+1 day'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'pending', null, datetime('now')),

-- Ertesi Günün Siparişleri (25 adet)
('o53', 'c4', 'new', datetime('now', '+2 days'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now')),
('o54', 'c5', 'new', datetime('now', '+2 days'), 'Beyoğlu', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 280.00, 'paid', null, datetime('now')),
('o55', 'c6', 'new', datetime('now', '+2 days'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'pending', null, datetime('now')),
('o56', 'c7', 'new', datetime('now', '+2 days'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'paid', null, datetime('now')),
('o57', 'c8', 'new', datetime('now', '+2 days'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'pending', null, datetime('now')),
('o58', 'c1', 'new', datetime('now', '+2 days'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'paid', null, datetime('now')),
('o59', 'c2', 'new', datetime('now', '+2 days'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'pending', null, datetime('now')),
('o60', 'c3', 'new', datetime('now', '+2 days'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'paid', null, datetime('now')),
('o61', 'c4', 'new', datetime('now', '+2 days'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now')),
('o62', 'c5', 'new', datetime('now', '+2 days'), 'İstiklal', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 280.00, 'paid', null, datetime('now')),
('o63', 'c6', 'new', datetime('now', '+2 days'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'pending', null, datetime('now')),
('o64', 'c7', 'new', datetime('now', '+2 days'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'paid', null, datetime('now')),
('o65', 'c8', 'new', datetime('now', '+2 days'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'pending', null, datetime('now')),
('o66', 'c1', 'new', datetime('now', '+2 days'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'paid', null, datetime('now')),
('o67', 'c2', 'new', datetime('now', '+2 days'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'pending', null, datetime('now')),
('o68', 'c3', 'new', datetime('now', '+2 days'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'paid', null, datetime('now')),
('o69', 'c4', 'new', datetime('now', '+2 days'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now')),
('o70', 'c5', 'new', datetime('now', '+2 days'), 'İstiklal', 'İstanbul', 'Beyoğlu', 'Zeynep Aydın', '5555556677', 280.00, 280.00, 'paid', null, datetime('now')),
('o71', 'c6', 'new', datetime('now', '+2 days'), 'Teşvikiye', 'İstanbul', 'Şişli', 'Can Yılmaz', '5556667788', 420.00, 420.00, 'pending', null, datetime('now')),
('o72', 'c7', 'new', datetime('now', '+2 days'), 'Caddebostan', 'İstanbul', 'Kadıköy', 'Elif Çelik', '5557778899', 190.00, 190.00, 'paid', null, datetime('now')),
('o73', 'c8', 'new', datetime('now', '+2 days'), 'Fenerbahçe', 'İstanbul', 'Kadıköy', 'Murat Şahin', '5558889900', 225.00, 225.00, 'pending', null, datetime('now')),
('o74', 'c1', 'new', datetime('now', '+2 days'), 'Bağdat Caddesi', 'İstanbul', 'Kadıköy', 'Ayşe Yılmaz', '5551112233', 300.00, 300.00, 'paid', null, datetime('now')),
('o75', 'c2', 'new', datetime('now', '+2 days'), 'Şişli', 'İstanbul', 'Şişli', 'Mehmet Demir', '5552223344', 175.00, 175.00, 'pending', null, datetime('now')),
('o76', 'c3', 'new', datetime('now', '+2 days'), 'Ataşehir', 'İstanbul', 'Ataşehir', 'Fatma Kaya', '5553334455', 320.00, 320.00, 'paid', null, datetime('now')),
('o77', 'c4', 'new', datetime('now', '+2 days'), 'Üsküdar', 'İstanbul', 'Üsküdar', 'Ali Öztürk', '5554445566', 150.00, 150.00, 'pending', null, datetime('now', '-5 hours'));

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
('oi10', 'o10', 'p4', 1, 350.00, 200.00),
('oi11', 'o11', 'p1', 1, 350.00, 200.00),
('oi12', 'o12', 'p3', 1, 350.00, 200.00),
('oi13', 'o13', 'p4', 1, 350.00, 200.00),
('oi14', 'o14', 'p5', 1, 350.00, 200.00),
('oi15', 'o15', 'p4', 1, 350.00, 200.00),
('oi16', 'o16', 'p6', 1, 350.00, 200.00),
('oi17', 'o17', 'p1', 1, 350.00, 200.00),
('oi18', 'o18', 'p4', 1, 350.00, 200.00),
('oi19', 'o19', 'p3', 1, 350.00, 200.00),
('oi20', 'o20', 'p2', 1, 350.00, 200.00),
('oi21', 'o21', 'p1', 2, 250.00, 150.00),
('oi22', 'o22', 'p2', 1, 180.00, 100.00),
('oi23', 'o23', 'p3', 2, 150.00, 80.00),
('oi24', 'o24', 'p4', 1, 350.00, 200.00),
('oi25', 'o25', 'p5', 1, 450.00, 250.00),
('oi26', 'o26', 'p6', 1, 300.00, 180.00),
('oi27', 'o27', 'p1', 1, 250.00, 150.00),
('oi28', 'o28', 'p2', 2, 180.00, 100.00),
('oi29', 'o29', 'p3', 1, 150.00, 80.00),
('oi30', 'o30', 'p4', 1, 350.00, 200.00),
('oi31', 'o31', 'p5', 1, 450.00, 250.00),
('oi32', 'o32', 'p6', 1, 300.00, 180.00),
('oi33', 'o33', 'p1', 1, 250.00, 150.00),
('oi34', 'o34', 'p2', 2, 180.00, 100.00),
('oi35', 'o35', 'p3', 1, 150.00, 80.00),
('oi36', 'o36', 'p4', 1, 350.00, 200.00),
('oi37', 'o37', 'p5', 1, 450.00, 250.00),
('oi38', 'o38', 'p1', 2, 250.00, 150.00),
('oi39', 'o39', 'p2', 3, 180.00, 100.00),
('oi40', 'o40', 'p3', 1, 150.00, 80.00),
('oi41', 'o41', 'p4', 1, 350.00, 200.00),
('oi42', 'o42', 'p5', 1, 450.00, 250.00),
('oi43', 'o43', 'p6', 1, 300.00, 180.00),
('oi44', 'o44', 'p1', 2, 250.00, 150.00),
('oi45', 'o45', 'p2', 1, 180.00, 100.00),
('oi46', 'o46', 'p3', 2, 150.00, 80.00),
('oi47', 'o47', 'p4', 1, 350.00, 200.00),
('oi48', 'o48', 'p5', 1, 450.00, 250.00),
('oi49', 'o49', 'p6', 1, 300.00, 180.00),
('oi50', 'o50', 'p1', 2, 250.00, 150.00),
('oi51', 'o51', 'p2', 1, 180.00, 100.00),
('oi52', 'o52', 'p3', 2, 150.00, 80.00),
('oi53', 'o53', 'p4', 1, 350.00, 200.00),
('oi54', 'o54', 'p5', 1, 450.00, 250.00),
('oi55', 'o55', 'p6', 2, 300.00, 180.00),
('oi56', 'o56', 'p1', 1, 250.00, 150.00),
('oi57', 'o57', 'p2', 1, 180.00, 100.00),
('oi58', 'o58', 'p3', 2, 150.00, 80.00),
('oi59', 'o59', 'p4', 1, 350.00, 200.00),
('oi60', 'o60', 'p5', 1, 450.00, 250.00),
('oi61', 'o61', 'p6', 1, 300.00, 180.00),
('oi62', 'o62', 'p1', 2, 250.00, 150.00),
('oi63', 'o63', 'p2', 3, 180.00, 100.00),
('oi64', 'o64', 'p3', 1, 150.00, 80.00),
('oi65', 'o65', 'p4', 1, 350.00, 200.00),
('oi66', 'o66', 'p5', 1, 450.00, 250.00),
('oi67', 'o67', 'p6', 1, 300.00, 180.00),
('oi68', 'o68', 'p1', 2, 250.00, 150.00),
('oi69', 'o69', 'p2', 1, 180.00, 100.00),
('oi70', 'o70', 'p3', 2, 150.00, 80.00),
('oi71', 'o71', 'p4', 1, 350.00, 200.00),
('oi72', 'o72', 'p5', 1, 450.00, 250.00),
('oi73', 'o73', 'p6', 1, 300.00, 180.00),
('oi74', 'o74', 'p1', 2, 250.00, 150.00),
('oi75', 'o75', 'p2', 1, 180.00, 100.00),
('oi76', 'o76', 'p3', 2, 150.00, 80.00),
('oi77', 'o77', 'p4', 1, 350.00, 200.00);

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

-- 40 Yeni Müşteri Ekleme
INSERT INTO customers (id, name, email, phone, address, city, district, notes, customer_type, company_name) VALUES
('c16', 'Hakan Yıldırım', 'hakan@email.com', '5551234567', 'Nişantaşı', 'İstanbul', 'Şişli', 'Premium müşteri', 'retail', null),
('c17', 'Sevgi Kılıç', 'sevgi@firma.com', '5552345678', 'Zorlu Center', 'İstanbul', 'Beşiktaş', 'Kurumsal müşteri', 'corporate', 'Zorlu AŞ'),
('c18', 'Cem Karaca', 'cem@email.com', '5553456789', 'Moda', 'İstanbul', 'Kadıköy', null, 'retail', null),
('c19', 'Pınar Demir', 'pinar@firma.com', '5554567890', 'Kanyon', 'İstanbul', 'Levent', 'Aylık düzenli sipariş', 'corporate', 'Kanyon AVM'),
('c20', 'Tolga Sarı', 'tolga@email.com', '5555678901', 'Bebek', 'İstanbul', 'Beşiktaş', 'VIP müşteri', 'retail', null);

-- 40 Yeni Sipariş Ekleme
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_time_slot, delivery_address, delivery_city, delivery_district, 
                   recipient_name, recipient_phone, subtotal, delivery_fee, total_amount, payment_status, payment_method) VALUES
('o78', 'c16', 'new', datetime('now', '+3 days'), 'morning', 'Nişantaşı', 'İstanbul', 'Şişli', 'Hakan Yıldırım', '5551234567', 450.00, 20.00, 470.00, 'pending', 'credit_card'),
('o79', 'c17', 'preparing', datetime('now', '+3 days'), 'afternoon', 'Zorlu Center', 'İstanbul', 'Beşiktaş', 'Sevgi Kılıç', '5552345678', 380.00, 20.00, 400.00, 'paid', 'bank_transfer'),
('o80', 'c18', 'new', datetime('now', '+3 days'), 'evening', 'Moda', 'İstanbul', 'Kadıköy', 'Cem Karaca', '5553456789', 290.00, 20.00, 310.00, 'pending', 'cash');

-- 40 Yeni Sipariş Detayı Ekleme
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, cost_price) VALUES
('oi78', 'o78', 'p1', 2, 250.00, 150.00),
('oi79', 'o79', 'p2', 3, 180.00, 100.00),
('oi80', 'o80', 'p3', 1, 150.00, 80.00);

-- 40 Yeni Tedarikçi Siparişi Ekleme
INSERT INTO purchase_orders (id, supplier_id, status, total_amount, payment_status, created_at) VALUES
('po4', 's1', 'ordered', 2500.00, 'pending', datetime('now', '-2 days')),
('po5', 's2', 'received', 1800.00, 'paid', datetime('now', '-1 day')),
('po6', 's3', 'draft', 3200.00, 'pending', datetime('now'));

-- 40 Yeni Tedarikçi Sipariş Detayı Ekleme
INSERT INTO purchase_order_items (id, purchase_order_id, product_id, quantity, unit_price, total_price) VALUES
('poi4', 'po4', 'p1', 25, 100.00, 2500.00),
('poi5', 'po5', 'p2', 18, 100.00, 1800.00),
('poi6', 'po6', 'p4', 12, 300.00, 3600.00);