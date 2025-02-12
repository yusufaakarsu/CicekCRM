import { Hono } from 'hono'
import { cors } from 'hono/cors'

const api = new Hono()

// Tüm originlere izin ver (development için)
api.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

api.get('/', () => new Response('API Running'))

api.get('/stats', async (c) => {
  const db = c.env.DB
  
  try {
    console.log('Running database queries...')
    
    const sql = {
      customers: 'SELECT COUNT(*) as count FROM customers',
      todayOrders: "SELECT COUNT(*) as count FROM orders WHERE date(delivery_date) = date('now')",
      pendingOrders: "SELECT COUNT(*) as count FROM orders WHERE status IN ('new', 'preparing')"
    }

    const [customers, orders, pending] = await Promise.all([
      db.prepare(sql.customers).first(),
      db.prepare(sql.todayOrders).first(),
      db.prepare(sql.pendingOrders).first()
    ])
    
    const result = {
      customersTotal: Number(customers?.count || 0),
      ordersToday: Number(orders?.count || 0),
      pendingDeliveries: Number(pending?.count || 0)
    }
    
    console.log('Query results:', result)
    return c.json(result)
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ error: error.message }, 500)
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

export default api
