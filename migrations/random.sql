-- 1. Müşteriler (100 yeni müşteri)
WITH RECURSIVE customers_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM customers_series WHERE n < 100
)
INSERT INTO customers (id, name, email, phone, address, city, district, notes, created_at)
SELECT 
    'c' || (9 + n), -- c9'dan başlayarak ID'ler
    'Müşteri ' || (n + 8) || ' Adı',
    'musteri' || (n + 8) || '@email.com',
    '555' || substr('0000000' || (abs(random()) % 10000000), -7), -- Rastgele telefon numarası
    'Adres ' || (n + 8),
    CASE abs(random()) % 5 
        WHEN 0 THEN 'İstanbul' 
        WHEN 1 THEN 'Ankara' 
        WHEN 2 THEN 'İzmir' 
        WHEN 3 THEN 'Bursa' 
        ELSE 'Antalya' 
    END, -- Rastgele şehir
    CASE abs(random()) % 5 
        WHEN 0 THEN 'Kadıköy' 
        WHEN 1 THEN 'Beşiktaş' 
        WHEN 2 THEN 'Çankaya' 
        WHEN 3 THEN 'Bornova' 
        ELSE 'Osmangazi' 
    END, -- Rastgele ilçe
    CASE abs(random()) % 3 
        WHEN 0 THEN 'VIP Müşteri' 
        WHEN 1 THEN 'Yeni Müşteri' 
        ELSE NULL 
    END, -- Rastgele notlar
    datetime('now', '-' || (abs(random()) % 30) || ' days') -- Rastgele oluşturulma tarihi
FROM customers_series;

-- 2. Tedarikçiler (20 yeni tedarikçi)
WITH RECURSIVE suppliers_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM suppliers_series WHERE n < 20
)
INSERT INTO suppliers (id, name, contact_name, phone, email, address, tax_number)
SELECT 
    's' || (4 + n), -- s4'ten başlayarak ID'ler
    'Tedarikçi ' || (n + 3),
    'İletişim ' || (n + 3),
    '530' || substr('0000000' || (abs(random()) % 10000000), -7), -- Rastgele telefon numarası
    'tedarikci' || (n + 3) || '@email.com',
    'Adres ' || (n + 3),
    substr('0000000000' || (abs(random()) % 1000000000), -10) -- Rastgele vergi numarası
FROM suppliers_series;

-- 3. Ürün Kategorileri (5 yeni kategori)
WITH RECURSIVE categories_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM categories_series WHERE n < 5
)
INSERT INTO product_categories (id, name, description)
SELECT 
    'cat' || (6 + n), -- cat6'dan başlayarak ID'ler
    'Kategori ' || (n + 5),
    'Açıklama ' || (n + 5)
FROM categories_series;

-- 4. Ürünler (50 yeni ürün)
WITH RECURSIVE products_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM products_series WHERE n < 50
)
INSERT INTO products (id, category_id, name, description, purchase_price, retail_price, wholesale_price, stock)
SELECT 
    'p' || (7 + n), -- p7'den başlayarak ID'ler
    'cat' || (abs(random()) % 5 + 1), -- Rastgele kategori ID
    'Ürün ' || (n + 6),
    'Açıklama ' || (n + 6),
    round((abs(random()) % 1000) / 10.0, 2), -- Rastgele alış fiyatı (0-100 arası)
    round((abs(random()) % 2000) / 10.0, 2), -- Rastgele perakende fiyatı (0-200 arası)
    round((abs(random()) % 1500) / 10.0, 2), -- Rastgele toptan fiyatı (0-150 arası)
    abs(random()) % 100 -- Rastgele stok (0-100 arası)
FROM products_series;

-- 5. Siparişler (500 yeni sipariş)
WITH RECURSIVE orders_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM orders_series WHERE n < 500
)
INSERT INTO orders (id, customer_id, status, delivery_date, delivery_address, delivery_city, delivery_district, recipient_name, recipient_phone, subtotal, total_amount, payment_status, notes, created_at)
SELECT 
    'o' || (78 + n), -- o78'den başlayarak ID'ler
    'c' || (abs(random()) % 100 + 1), -- Rastgele müşteri ID
    CASE abs(random()) % 6 
        WHEN 0 THEN 'new' 
        WHEN 1 THEN 'preparing' 
        WHEN 2 THEN 'ready' 
        WHEN 3 THEN 'delivering' 
        WHEN 4 THEN 'delivered' 
        ELSE 'cancelled' 
    END, -- Yalnızca geçerli durumlar
    datetime('now', '+' || (abs(random()) % 30) || ' days'), -- Rastgele teslimat tarihi
    'Adres ' || (n + 77),
    CASE abs(random()) % 5 
        WHEN 0 THEN 'İstanbul' 
        WHEN 1 THEN 'Ankara' 
        WHEN 2 THEN 'İzmir' 
        WHEN 3 THEN 'Bursa' 
        ELSE 'Antalya' 
    END, -- Rastgele şehir
    CASE abs(random()) % 5 
        WHEN 0 THEN 'Kadıköy' 
        WHEN 1 THEN 'Beşiktaş' 
        WHEN 2 THEN 'Çankaya' 
        WHEN 3 THEN 'Bornova' 
        ELSE 'Osmangazi' 
    END, -- Rastgele ilçe
    'Alıcı ' || (n + 77),
    '555' || substr('0000000' || (abs(random()) % 10000000), -7), -- Rastgele telefon numarası
    round((abs(random()) % 1000) + 50, 2), -- Rastgele alt toplam (50-1050 arası)
    round((abs(random()) % 1000) + 50, 2), -- Rastgele toplam tutar (50-1050 arası)
    CASE abs(random()) % 2 
        WHEN 0 THEN 'paid' 
        ELSE 'pending' 
    END, -- Rastgele ödeme durumu
    CASE abs(random()) % 3 
        WHEN 0 THEN 'Not 1' 
        WHEN 1 THEN 'Not 2' 
        ELSE NULL 
    END, -- Rastgele notlar
    datetime('now', '-' || (abs(random()) % 30) || ' days') -- Rastgele oluşturulma tarihi
FROM orders_series;

-- 6. Sipariş Kalemleri (1000 yeni sipariş kalemi)
WITH RECURSIVE order_items_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM order_items_series WHERE n < 1000
)
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, cost_price)
SELECT 
    'oi' || (78 + n), -- oi78'den başlayarak ID'ler
    'o' || (abs(random()) % 500 + 1), -- Rastgele sipariş ID
    'p' || (abs(random()) % 50 + 1), -- Rastgele ürün ID
    abs(random()) % 10 + 1, -- Rastgele miktar (1-10 arası)
    round((abs(random()) % 500) / 10.0, 2), -- Rastgele birim fiyat (0-50 arası)
    round((abs(random()) % 300) / 10.0, 2) -- Rastgele maliyet fiyatı (0-30 arası)
FROM order_items_series;

-- 7. Tedarikçi Siparişleri (50 yeni tedarikçi siparişi)
WITH RECURSIVE purchase_orders_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM purchase_orders_series WHERE n < 50
)
INSERT INTO purchase_orders (id, supplier_id, status, total_amount, payment_status, created_at)
SELECT 
    'po' || (4 + n), -- po4'ten başlayarak ID'ler
    's' || (abs(random()) % 20 + 1), -- Rastgele tedarikçi ID
    CASE abs(random()) % 3 
        WHEN 0 THEN 'draft' 
        WHEN 1 THEN 'ordered' 
        ELSE 'received' 
    END, -- Rastgele durum
    round((abs(random()) % 10000) + 100, 2), -- Rastgele toplam tutar (100-10100 arası)
    CASE abs(random()) % 2 
        WHEN 0 THEN 'paid' 
        ELSE 'pending' 
    END, -- Rastgele ödeme durumu
    datetime('now', '-' || (abs(random()) % 30) || ' days') -- Rastgele oluşturulma tarihi
FROM purchase_orders_series;

-- 8. Tedarikçi Sipariş Kalemleri (200 yeni tedarikçi sipariş kalemi)
WITH RECURSIVE purchase_order_items_series AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM purchase_order_items_series WHERE n < 200
)
INSERT INTO purchase_order_items (id, purchase_order_id, product_id, quantity, unit_price, total_price)
SELECT 
    'poi' || (4 + n), -- poi4'ten başlayarak ID'ler
    'po' || (abs(random()) % 50 + 1), -- Rastgele tedarikçi sipariş ID
    'p' || (abs(random()) % 50 + 1), -- Rastgele ürün ID
    abs(random()) % 100 + 1, -- Rastgele miktar (1-100 arası)
    round((abs(random()) % 500) / 10.0, 2), -- Rastgele birim fiyat (0-50 arası)
    round((abs(random()) % 5000) / 10.0, 2) -- Rastgele toplam fiyat (0-500 arası)
FROM purchase_order_items_series;