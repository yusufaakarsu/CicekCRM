import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Çiçek CRM - API Running')
})

app.get('/api/test-db', async (c) => {
  try {
    const db = c.env.DB
    const { results } = await db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all()
    return c.json({ 
      status: 'success',
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
