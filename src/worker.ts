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

export default app
