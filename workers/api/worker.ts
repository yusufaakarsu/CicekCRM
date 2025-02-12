import { Hono } from 'hono'
import { cors } from 'hono/cors'

const api = new Hono()

api.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

api.get('/', () => new Response('API Running'))

// Ana sayfa istatistikleri için endpoint
api.get('/stats', async (c) => {
  const db = c.env.DB
  try {
    const results = await Promise.all([
      // Bugünkü siparişler
      db.prepare(`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE DATE(delivery_date) = DATE('now')`
      ).first(),
      
      // Toplam müşteri sayısı
      db.prepare('SELECT COUNT(*) as count FROM customers').first(),
      
      // Bekleyen teslimatlar
      db.prepare(`
        SELECT COUNT(*) as count 
        FROM orders 
        WHERE status IN ('new', 'preparing', 'delivering')`
      ).first(),

      // Düşük stok ürünleri
      db.prepare(`
        SELECT COUNT(*) as count 
        FROM products 
        WHERE stock <= min_stock`
      ).first()
    ])

    return c.json({
      ordersToday: results[0].count,
      customersTotal: results[1].count,
      pendingDeliveries: results[2].count,
      lowStockCount: results[3].count
    })
  } catch (error) {
    console.error('Stats Error:', error)
    return c.json({ error: 'Database error' }, 500)
  }
})

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

export default api
