import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Çiçek CRM - API Running')
})

export default app
