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
    const [todayDeliveries, { results: tomorrowNeeds }, { results: orderSummary }, lowStock] = await Promise.all([
      // 1. Bugünün teslimat durumu
      db.prepare(`
        SELECT 
          COUNT(*) as total_orders,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
          SUM(CASE WHEN status NOT IN ('delivered', 'cancelled') THEN 1 END) as pending_orders
        FROM orders 
        WHERE DATE(delivery_date) = DATE('now')
      `).first(),

      // 2. Yarının siparişleri için ürün ihtiyacı
      db.prepare(`
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
      `).all(),

      // 3. Teslimat programı
      db.prepare(`
        SELECT 
          date(delivery_date) as date,
          COUNT(*) as count
        FROM orders
        WHERE date(delivery_date) BETWEEN date('now') AND date('now', '+2 days')
        GROUP BY date(delivery_date)
        ORDER BY date
      `).all(),

      // 4. Düşük stok sayısı
      db.prepare(`SELECT COUNT(*) as count FROM products WHERE stock <= min_stock`).first()
    ]);

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

// Finans istatistikleri
api.get('/api/finance/stats', async (c) => {
  const db = c.env.DB;
  try {
    const [dailyRevenue, monthlyIncome, pendingPayments, paymentStatus] = await Promise.all([
      // Günlük ciro
      db.prepare(`
        SELECT COALESCE(SUM(total_amount), 0) as revenue
        FROM orders 
        WHERE DATE(created_at) = DATE('now')
        AND status != 'cancelled'
      `).first(),

      // Aylık gelir
      db.prepare(`
        SELECT COALESCE(SUM(total_amount), 0) as revenue
        FROM orders 
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        AND status != 'cancelled'
      `).first(),

      // Bekleyen ödemeler
      db.prepare(`
        SELECT COALESCE(SUM(total_amount), 0) as amount
        FROM orders 
        WHERE payment_status = 'pending'
      `).first(),

      // Ödeme durumu dağılımı
      db.prepare(`
        SELECT 
          COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid,
          COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN payment_status = 'cancelled' THEN 1 END) as cancelled
        FROM orders
      `).first()
    ]);

    // Kar marjı hesapla
    const costs = await db.prepare(`
      SELECT COALESCE(SUM(oi.quantity * oi.cost_price), 0) as total_cost
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE strftime('%Y-%m', o.created_at) = strftime('%Y-%m', 'now')
      AND o.status != 'cancelled'
    `).first();

    const profitMargin = monthlyIncome.revenue > 0 
      ? Math.round((monthlyIncome.revenue - costs.total_cost) / monthlyIncome.revenue * 100) 
      : 0;

    return c.json({
      dailyRevenue: dailyRevenue.revenue,
      monthlyIncome: monthlyIncome.revenue,
      pendingPayments: pendingPayments.amount,
      profitMargin,
      paymentStatus
    });

  } catch (error) {
    console.error('Finance stats error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Son finansal işlemler
api.get('/api/finance/transactions', async (c) => {
  const db = c.env.DB;
  try {
    const { results } = await db.prepare(`
      SELECT 
        o.id as order_id,
        o.created_at,
        o.total_amount as amount,
        o.payment_status as status,
        c.name as customer_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `).all();

    return c.json(results);

  } catch (error) {
    console.error('Transactions error:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Müşterileri listele
api.get('/customers', async (c) => {
  const db = c.env.DB
  try {
    const { results } = await db.prepare(`
      SELECT 
        c.*,
        COUNT(o.id) as total_orders,
        MAX(o.created_at) as last_order,
        SUM(o.total_amount) as total_spent
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.name, c.phone, c.email, c.address
      ORDER BY c.name
    `).all()
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

// Müşteri detaylarını getir
api.get('/customers/:id', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();
  
  try {
    // Müşteri bilgileri ve sipariş özeti
    const customer = await db.prepare(`
      SELECT 
        c.*,
        COUNT(o.id) as total_orders,
        MAX(o.created_at) as last_order,
        SUM(o.total_amount) as total_spent
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE c.id = ?
      GROUP BY c.id
    `).bind(id).first();

    if (!customer) {
      return c.json({ error: 'Customer not found' }, 404);
    }

    return c.json(customer);
  } catch (error) {
    return c.json({ error: 'Database error' }, 500);
  }
});

// Müşterinin siparişlerini getir
api.get('/customers/:id/orders', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();
  
  try {
    const { results: orders } = await db.prepare(`
      SELECT o.*, GROUP_CONCAT(oi.quantity || 'x ' || p.name) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.customer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `).bind(id).all();

    return c.json(orders);
  } catch (error) {
    return c.json({ error: 'Database error' }, 500);
  }
});

// Müşteri güncelle
api.put('/customers/:id', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();
  const body = await c.req.json();
  
  try {
    await db.prepare(`
      UPDATE customers 
      SET name = ?, phone = ?, email = ?, address = ?
      WHERE id = ?
    `).bind(body.name, body.phone, body.email, body.address, id).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Database error' }, 500);
  }
});

// Filtrelenmiş siparişleri getir
api.get('/orders/filtered', async (c) => {
  const db = c.env.DB;
  const { status, date_filter, start_date, end_date, sort, page, per_page } = c.req.query();
  
  try {
    let query = `
      SELECT 
        o.*,
        c.name as customer_name,
        GROUP_CONCAT(oi.quantity || 'x ' || p.name) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE 1=1
    `;
    
    const params = [];

    // Status filtresi
    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    // Tarih filtresi
    if (date_filter) {
      switch (date_filter) {
        case 'today':
          query += ` AND DATE(o.delivery_date) = DATE('now')`;
          break;
        case 'tomorrow':
          query += ` AND DATE(o.delivery_date) = DATE('now', '+1 day')`;
          break;
        case 'week':
          query += ` AND DATE(o.delivery_date) BETWEEN DATE('now') AND DATE('now', '+7 days')`;
          break;
        case 'month':
          query += ` AND strftime('%Y-%m', o.delivery_date) = strftime('%Y-%m', 'now')`;
          break;
      }
    } else if (start_date && end_date) {
      query += ` AND DATE(o.delivery_date) BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    // Grup ve sıralama
    query += ` GROUP BY o.id`;

    // Sıralama
    if (sort) {
      const [field, direction] = sort.split('_');
      const sortField = field === 'date' ? 'o.delivery_date' : 'o.total_amount';
      query += ` ORDER BY ${sortField} ${direction.toUpperCase()}`;
    } else {
      query += ` ORDER BY o.delivery_date DESC`;
    }

    // Toplam kayıt sayısı
    const countQuery = query.replace(
      'SELECT o.*, c.name as customer_name, GROUP_CONCAT(oi.quantity || \'x \' || p.name) as items',
      'SELECT COUNT(DISTINCT o.id) as total'
    );
    const { total } = await db.prepare(countQuery).bind(...params).first();

    // Sayfalama
    const pageNum = parseInt(page) || 1;
    const perPage = parseInt(per_page) || 10;
    const offset = (pageNum - 1) * perPage;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(perPage, offset);

    const { results } = await db.prepare(query).bind(...params).all();

    return c.json({
      orders: results,
      total,
      page: pageNum,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage)
    });

  } catch (error) {
    console.error('Orders filter error:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

// Sipariş iptal et
api.put('/orders/:id/cancel', async (c) => {
  const db = c.env.DB;
  const { id } = c.req.param();
  
  try {
    await db.prepare(`
      UPDATE orders 
      SET status = 'cancelled',
          updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(id).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Database error' }, 500);
  }
});

export default api
