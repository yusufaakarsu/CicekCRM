import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Bugünün teslimat istatistikleri
    const deliveryStats = await db.prepare(`
      WITH today_orders AS (
        SELECT 
          COUNT(*) as total_orders,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
          SUM(CASE WHEN status != 'delivered' AND status != 'cancelled' THEN 1 ELSE 0 END) as pending_orders
        FROM orders 
        WHERE date(delivery_date) = date('now')
      )
      SELECT * FROM today_orders
    `).all();

    // Yarın için stok durumu
    const stockNeeds = await db.prepare(`
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
      SELECT * FROM tomorrow_needs
    `).all();

    return NextResponse.json({
      deliveryStats: deliveryStats[0],
      stockNeeds
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
