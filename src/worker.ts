import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// CORS middleware
app.use('*', cors())

// Test endpoint
app.get('/', (c) => {
  return c.json({ status: 'Çiçek CRM API Running' })
})

// DB test endpoint
app.get('/api/db-test', async (c) => {
  try {
    const db = c.env.DB
    const { results } = await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all()
    return c.json({ 
      status: 'success',
      message: 'Database connected',
      tables: results.map(r => r.name)
    })
  } catch (error) {
    return c.json({ 
      status: 'error',
      message: error.message 
    }, 500)
  }
})

// API Routes
app.get('/api/stats', async (c) => {
  const db = c.env.DB
  
  try {
    const [customers, orders] = await Promise.all([
      db.prepare('SELECT COUNT(*) as count FROM customers').first(),
      db.prepare('SELECT COUNT(*) as count FROM orders WHERE DATE(delivery_date) = DATE("now")').first()
    ])

    return c.json({
      customersTotal: customers?.count || 0,
      ordersToday: orders?.count || 0,
      pendingDeliveries: 0
    })
  } catch (error) {
    return c.json({ error: 'Database error' }, 500)
  }
})

export default app
