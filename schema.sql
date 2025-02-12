
-- Müşteriler Tablosu
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    city TEXT,
    district TEXT,
    notes TEXT,
    customer_type TEXT CHECK(customer_type IN ('retail', 'corporate')) DEFAULT 'retail',
    tax_number TEXT,
    company_name TEXT,
    special_dates TEXT,  -- JSON formatında özel günler (doğum günü, yıldönümü vb.)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ürün Kategorileri
CREATE TABLE product_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- Ürünler Tablosu
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    category_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    purchase_price DECIMAL(10,2) NOT NULL,  -- Alış fiyatı
    retail_price DECIMAL(10,2) NOT NULL,    -- Satış fiyatı
    wholesale_price DECIMAL(10,2),          -- Toptan fiyat
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,            -- Minimum stok uyarı seviyesi
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES product_categories(id)
);

-- Tedarikçiler Tablosu
CREATE TABLE suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    tax_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Siparişler Tablosu
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('new', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')) DEFAULT 'new',
    
    -- Teslimat Bilgileri
    delivery_date DATETIME NOT NULL,
    delivery_time_slot TEXT,  -- Sabah, öğlen, akşam gibi
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_district TEXT NOT NULL,
    delivery_notes TEXT,
    
    -- Alıcı Bilgileri
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    recipient_notes TEXT,
    
    -- Fiyatlandırma
    subtotal DECIMAL(10,2) NOT NULL,        -- Ara toplam
    delivery_fee DECIMAL(10,2) DEFAULT 0,   -- Teslimat ücreti
    discount_amount DECIMAL(10,2) DEFAULT 0, -- İndirim tutarı
    total_amount DECIMAL(10,2) NOT NULL,    -- Toplam tutar
    
    -- Ödeme Bilgileri
    payment_status TEXT CHECK(payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    payment_method TEXT CHECK(payment_method IN ('cash', 'credit_card', 'bank_transfer')),
    payment_notes TEXT,
    
    source TEXT CHECK(source IN ('web', 'phone', 'store', 'other')) DEFAULT 'store',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

-- Sipariş Detayları
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,  -- Satış anındaki birim fiyat
    cost_price DECIMAL(10,2) NOT NULL,  -- Satış anındaki maliyet
    notes TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- Tedarikçi Siparişleri
CREATE TABLE purchase_orders (
    id TEXT PRIMARY KEY,
    supplier_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('draft', 'ordered', 'received', 'cancelled')) DEFAULT 'draft',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT CHECK(payment_status IN ('pending', 'paid', 'partial')) DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
);

-- Tedarikçi Sipariş Detayları
CREATE TABLE purchase_order_items (
    id TEXT PRIMARY KEY,
    purchase_order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(purchase_order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- İndeksler
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category_id);
