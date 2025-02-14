## Kod Düzenleme Kuralları

1. Mevcut Yapıyı Koru
- Proje yapısını değiştirmeden çalış
- Var olan dosya/klasör yapısına sadık kal 
- Yeni dosya/klasör oluşturmadan önce iki kez düşün

2. Minimal Değişiklik
- Çalışan kodu gereksiz yere değiştirme
- Sadece gerekli olan değişiklikleri yap
- "Daha iyi olur" diye çalışan kodu bozma

3. Test Et
- Çalıştığından emin olmadan commit etme
- Hata varsa hemen geri al

4. Git Kuralları
```bash
# Development branch'inde çalış
git checkout development

# Değişiklikleri commitle
git add .
git commit -m "Açıklayıcı commit mesajı"

# Push yap
git push origin development
```

5. Worker Değişiklikleri
```bash
cd workers/api
wrangler deploy
```

## Notlar

- Her değişiklik için commit mesajı yazılmalı
- Worker değişikliklerinde wrangler deploy yapılmalı
- Frontend değişikliklerinde branch'e push yapılmalı
- Terminal kodları verilirken yorum satırı bırakılmamalı 

# Çiçek CRM

Çiçekçi sipariş ve müşteri yönetim sistemi.

## Proje Yapısı ve Açıklamalar

```
/CicekCRM
├── migrations/                      # Veritabanı veri dosyaları
│   └── data.sql                    # Örnek veriler ve seed data
├── public/                         # Frontend ana klasörü
│   ├── calendar/                   # Takvim görünümü modülü
│   │   ├── calendar.js            # Takvim mantığı ve görünümü
│   │   └── index.html            # Takvim sayfası
│   ├── common/                    # Ortak UI bileşenleri
│   │   ├── header.html           # Site üst menü
│   │   └── layout.html           # Ana sayfa düzeni
│   ├── css/                      # Stil dosyaları
│   │   └── style.css            # Ana stil tanımları
│   ├── customers/                # Müşteri yönetimi modülü
│   │   ├── customers.js         # Müşteri işlemleri 
│   │   └── index.html           # Müşteri listeleme sayfası
│   ├── finance/                 # Finans modülü
│   │   └── index.html           # Finans rapor sayfası
│   ├── js/                      # JavaScript ana klasörü
│   │   ├── common.js           # Ortak fonksiyonlar
│   │   ├── customers.js        # Müşteri mantık işlemleri
│   │   ├── dashboard.js        # Panel fonksiyonları
│   │   ├── finance.js          # Finans hesaplamaları
│   │   └── orders.js           # Sipariş işlemleri
│   ├── orders/                 # Sipariş modülü
│   │   ├── index.html         # Sipariş listeleme
│   │   ├── new.html           # Yeni sipariş formu
│   │   └── orders.js          # Sipariş sayfası mantığı
│   └── index.html             # Ana sayfa
├── workers/                    # Cloudflare Workers klasörü
│   └── api/                   # API servisleri
│       ├── package.json       # API bağımlılıkları
│       ├── worker.ts         # API endpoint kodları
│       └── wrangler.toml     # Cloudflare yapılandırması
├── PLAN.md                    # Geliştirme planı ve notlar
├── README.md                  # Proje dokümantasyonu
└── schema.sql               # Veritabanı tablo yapısı
```

## Teknolojiler

- Backend: Cloudflare Workers
- Frontend: Vanilla JS + Bootstrap
- Veritabanı: Cloudflare D1 (SQLite)

## Geliştirme

1. Bağımlılıkları yükle:
```bash
npm install
```

2. Geliştirme sunucusunu başlat:
```bash
npm run dev
```

3. Production'a deploy et:
```bash
npm run deploy
```

## Git İş Akışı

1. Development branch'inde çalış
2. Her değişiklik için:
```bash

git add .
git commit -m "Değişiklik açıklaması"
git push origin development

```

3. Worker değişikliklerinde deploy:
```bash

cd workers/api
wrangler deploy

```
4. veritabanı işlemleri:
```bash

wrangler d1 execute cicek-crm-db --remote --file=./schema.sql
wrangler d1 execute cicek-crm-db --remote --file=./migrations/data.sql

```

## Git Komutları

Development branch'te çalışırken:

git add .
git commit -m "feat: Değişiklik mesajı"
git push origin development

## Worker Komutları

API değişikliklerinde:

cd /Users/yusuf/Downloads/kod/CicekCRM/workers/api
wrangler deploy

## Veritabanı Komutları

Schema ve veri güncellemelerinde:

cd /Users/yusuf/Downloads/kod/CicekCRM/workers/api
wrangler d1 execute cicek-crm-db --remote --file=./schema.sql
wrangler d1 execute cicek-crm-db --remote --file=./migrations/data.sql

## Modüller

### Siparişler
- Sipariş listesi (/orders)
- Yeni sipariş (/orders/new)
- Sipariş detayları ve düzenleme
- Filtreleme ve arama
- Teslimat takibi

### Müşteriler
- Müşteri listesi (/customers)
- Yeni müşteri
- Müşteri detayları ve düzenleme

### Finans
- Gelir/gider takibi (/finance)
- Raporlar ve analizler

## API Endpoints

### Siparişler
- GET /api/orders - Sipariş listesi
- POST /api/orders - Yeni sipariş
- GET /api/orders/:id - Sipariş detayı
- PUT /api/orders/:id - Sipariş güncelleme
- PUT /api/orders/:id/status - Durum güncelleme

### Müşteriler
- GET /api/customers - Müşteri listesi
- POST /api/customers - Yeni müşteri
- GET /api/customers/:id - Müşteri detayı
- PUT /api/customers/:id - Müşteri güncelleme

## Veritabanı Şeması

### Ana Tablolar
- customers: (id, name, email, phone, address, city, district, notes, customer_type[retail|corporate], tax_number, company_name, special_dates[JSON], created_at, updated_at)
- product_categories: (id, name, description)
- products: (id, category_id->product_categories, name, description, purchase_price, retail_price, wholesale_price, stock, min_stock, created_at, updated_at)
- suppliers: (id, name, contact_name, phone, email, address, tax_number, notes, created_at)
- orders: (id, customer_id->customers, status[new|preparing|ready|delivering|delivered|cancelled], delivery_date, delivery_time_slot[morning|afternoon|evening], delivery_address, delivery_city, delivery_district, delivery_notes, delivery_status[pending|assigned|on_way|completed|failed], courier_notes, recipient_name, recipient_phone, recipient_note, recipient_address, card_message, recipient_alternative_phone, subtotal, delivery_fee, distance_fee, discount_amount, discount_code, total_amount, cost_price, profit_margin, payment_status[pending|paid|refunded], payment_method[cash|credit_card|bank_transfer], payment_notes, source[web|phone|store|other], notes, created_at, updated_at)
- order_items: (id, order_id->orders, product_id->products, quantity, unit_price, cost_price, notes)
- purchase_orders: (id, supplier_id->suppliers, status[draft|ordered|received|cancelled], total_amount, payment_status[pending|paid|partial], notes, created_at, updated_at)
- purchase_order_items: (id, purchase_order_id->purchase_orders, product_id->products, quantity, unit_price, total_price)

### İndeksler
- customers: phone
- orders: customer_id, delivery_date, status, delivery_status, payment_status, (delivery_date, status)
- order_items: order_id
- products: category_id
- purchase_orders: supplier_id
- purchase_order_items: purchase_order_id, product_id

### İstatistik Görünümleri
- finance_stats: (date, total_orders, revenue, costs, profit, margin)
- delivery_stats: (date, delivery_time_slot, delivery_district, total_deliveries, avg_delivery_fee, completed_deliveries)

### Foreign Key İlişkileri
- products -> product_categories (category_id)
- orders -> customers (customer_id)
- order_items -> orders (order_id)
- order_items -> products (product_id)
- purchase_orders -> suppliers (supplier_id)
- purchase_order_items -> purchase_orders (purchase_order_id)
- purchase_order_items -> products (product_id)


