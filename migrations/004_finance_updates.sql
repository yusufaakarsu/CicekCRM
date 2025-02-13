-- Sipariş tablosuna maliyet alanları ekle
ALTER TABLE orders ADD COLUMN cost_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN profit_margin DECIMAL(5,2) DEFAULT 0;

-- Ödeme durumu için indeks ekle
CREATE INDEX idx_payment_status ON orders(payment_status);

-- İstatistik görünümü oluştur
CREATE VIEW finance_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_orders,
    SUM(total_amount) as revenue,
    SUM(cost_price) as costs,
    (SUM(total_amount) - SUM(cost_price)) as profit,
    ROUND((SUM(total_amount) - SUM(cost_price)) / SUM(total_amount) * 100, 2) as margin
FROM orders 
WHERE status != 'cancelled'
GROUP BY DATE(created_at);
