export async function onRequest(context: any) {
  const { env } = context

  if (context.request.url.includes('/api/stats')) {
    try {
      const [customers, orders] = await Promise.all([
        env.DB.prepare('SELECT COUNT(*) as count FROM customers').first(),
        env.DB.prepare('SELECT COUNT(*) as count FROM orders WHERE DATE(delivery_date) = DATE("now")').first()
      ])

      return new Response(JSON.stringify({
        customersTotal: customers?.count || 0,
        ordersToday: orders?.count || 0,
        pendingDeliveries: 0
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response('Not found', { status: 404 })
}
