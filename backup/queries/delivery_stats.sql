-- Bugünün teslimat istatistikleri
WITH today_orders AS (
  SELECT 
    COUNT(*) as total_orders,
    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
    SUM(CASE WHEN status != 'delivered' AND status != 'cancelled' THEN 1 ELSE 0 END) as pending_orders
  FROM orders 
  WHERE date(delivery_date) = date('now')
)
SELECT 
  total_orders,
  delivered_orders,
  pending_orders,
  delivered_orders || ' / ' || total_orders || ' Teslimat' as delivery_status
FROM today_orders;
