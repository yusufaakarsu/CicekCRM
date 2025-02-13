import { Hono } from 'hono'
import { cors } from 'hono/cors'

const api = new Hono()

api.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

api.get('/', () => new Response('API Running'))

// Ana sayfa istatistikleri için tek endpoint
api.get('/api/dashboard', async (c) => {
  const db = c.env.DB;

  try {
    // 1. Bugünün teslimat durumu - Toplam ve teslim durumları
    const todayDeliveries = await db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(CASE WHEN status NOT IN ('delivered', 'cancelled') THEN 1 END) as pending_orders
      FROM orders 
      WHERE DATE(delivery_date) = DATE('now')
    `).first();

    // 2. Yarının siparişleri için ürün ihtiyacı
    const { results: tomorrowNeeds } = await db.prepare(`
      SELECT 
        p.name,
        p.stock as current_stock,
        SUM(oi.quantity) as needed_quantity
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE DATE(o.delivery_date) = DATE('now', '+1 day')
      GROUP BY p.id, p.name, p.stock
      ORDER BY needed_quantity DESC
    `).all();

    // 3. Teslimat programı
    const { results: orderSummary } = await db.prepare(`
      SELECT 
        date(delivery_date) as date,
        COUNT(*) as count
      FROM orders
      WHERE date(delivery_date) BETWEEN date('now') AND date('now', '+2 days')
      GROUP BY date(delivery_date)
      ORDER BY date
    `).all();

    // 4. Düşük stok sayısı
    const lowStock = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE stock <= min_stock
    `).first();

    return c.json({
      deliveryStats: todayDeliveries,
      tomorrowNeeds,
      orderSummary,
      lowStock: lowStock.count
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Müşterileri listele
api.get('/customers', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db
      .prepare('SELECT * FROM customers ORDER BY name')
      .all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Yeni müşteri ekle
api.post('/customers', async (c) => {
  const body = await c.req.json()
  const db = c.env.DB
  
  try {
    const result = await db
      .prepare(`
        INSERT INTO customers (name, phone, email, address)
        VALUES (?, ?, ?, ?)
      `)
      .bind(body.name, body.phone, body.email, body.address)
      .run()

    return c.json({ success: true, id: result.lastRowId })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Son müşteriler
api.get('/customers/recent', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db.prepare(`
      SELECT * FROM customers 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Bugünün teslimatları
api.get('/orders/today', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db.prepare(`
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE DATE(o.delivery_date) = DATE('now')
      ORDER BY o.delivery_date ASC
    `).all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Tüm siparişleri listele
api.get('/orders', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db
      .prepare(`
        SELECT o.*, c.name as customer_name 
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.delivery_date DESC
      `)
      .all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Son siparişler
api.get('/orders/recent', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db.prepare(`
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC 
      LIMIT 5
    `).all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Takvim görünümü için siparişler
api.get('/orders/calendar', async (c) => {
  const { start, end } = c.req.query()
  const db = c.env.DB
  
  try {
    const { results } = await db
      .prepare(`
        SELECT * FROM orders 
        WHERE delivery_date BETWEEN ? AND ?
        ORDER BY delivery_date ASC
      `)
      .bind(start, end)
      .all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Bugünün teslimatları
api.get('/calendar/today', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db
      .prepare(`
        SELECT o.*, c.name as customer_name 
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE DATE(o.delivery_date) = DATE('now')
        ORDER BY o.delivery_date ASC
      `)
      .all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Belirli tarih aralığındaki teslimatlar
api.get('/calendar/events', async (c) => {
  const { searchParams } = new URL(c.req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const db = c.env.DB
  try {
    const { results } = await db
      .prepare(`
        SELECT o.*, c.name as customer_name 
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE DATE(o.delivery_date) BETWEEN DATE(?) AND DATE(?)
        ORDER BY o.delivery_date ASC
      `)
      .bind(start, end)
      .all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Düşük stoklu ürünleri getir
api.get('/products/low-stock', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db
      .prepare('SELECT * FROM products WHERE stock <= min_stock ORDER BY stock ASC')
      .all()
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Sipariş özetlerini getir (3 günlük)
api.get('/orders/summary', async (c) => {
  const db = c.env.DB
  try {
    const [today, tomorrow, nextDay] = await Promise.all([
      db.prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(delivery_date) = DATE('now')").first(),
      db.prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(delivery_date) = DATE('now', '+1 day')").first(),
      db.prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(delivery_date) = DATE('now', '+2 day')").first()
    ])

    return c.json({
      today: today.count,
      tomorrow: tomorrow.count,
      nextDay: nextDay.count
    })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Detaylı son siparişler
api.get('/orders/recent-detailed', async (c) => {
  const db = c.env.DB
  try {
    const { results: orders } = await db.prepare(`
      SELECT o.*, c.name as customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC 
      LIMIT 10
    `).all()

    // Her sipariş için ürün detaylarını al
    for (let order of orders) {
      const { results: items } = await db.prepare(`
        SELECT oi.*, p.name 
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).bind(order.id).all()
      order.items = items
    }

    return c.json(orders)
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

export default api
