-- Yarın için gerekli stok durumu
WITH tomorrow_needs AS (
  SELECT 
    p.id,
    p.name,
    p.stock as current_stock,
    SUM(oi.quantity) as needed_quantity,
    p.min_stock,
    p.stock - SUM(oi.quantity) as remaining_stock
  FROM products p
  INNER JOIN order_items oi ON p.id = oi.product_id
  INNER JOIN orders o ON oi.order_id = o.id
  WHERE date(o.delivery_date) = date('now', '+1 day')
  GROUP BY p.id, p.name, p.stock, p.min_stock
  HAVING remaining_stock < min_stock
  ORDER BY remaining_stock ASC
)
SELECT 
  name as "Ürün",
  current_stock as "Mevcut Stok",
  needed_quantity as "Yarın İçin Gerekli",
  remaining_stock as "Kalan Stok",
  min_stock as "Minimum Stok",
  CASE 
    WHEN remaining_stock < 0 THEN ABS(remaining_stock) || ' adet eksik'
    WHEN remaining_stock < min_stock THEN 'Kritik seviye'
    ELSE 'Yeterli'
  END as "Durum"
FROM tomorrow_needs;
