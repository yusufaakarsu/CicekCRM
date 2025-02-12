import { Hono } from 'hono'
import { cors } from 'hono/cors'

const api = new Hono()

api.use('*', cors())

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

export default api
