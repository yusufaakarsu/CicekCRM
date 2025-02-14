# Çiçek CRM

Çiçekçi sipariş ve müşteri yönetim sistemi.

## Proje Yapısı

```
/CicekCRM
├── public/                # Frontend dosyaları
│   ├── common/           # Ortak HTML bileşenleri
│   ├── css/             # Stil dosyaları
│   ├── js/              # JavaScript dosyaları
│   ├── orders/          # Sipariş sayfaları
│   ├── customers/       # Müşteri sayfaları
│   └── index.html       # Ana sayfa
├── workers/             # Cloudflare Workers
│   └── api/            # API kodları
├── migrations/          # Veritabanı migrationları
├── schema.sql          # Veritabanı şeması
└── wrangler.toml       # Cloudflare yapılandırması
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

Ana tablolar:
- orders: Siparişler
- customers: Müşteriler
- products: Ürünler
- order_items: Sipariş detayları

İlişkisel tablolar:
- categories: Ürün kategorileri
- suppliers: Tedarikçiler
- purchase_orders: Tedarikçi siparişleri

## Deployment

1. Development'da test et
2. Main branch'e merge et
3. Production'a deploy et:
```bash
wrangler deployngler deploy
``````

## Notlar## Notlar

- Her değişiklik için commit mesajı yazılmalı
- Worker değişikliklerinde wrangler deploy yapılmalı
- Frontend değişikliklerinde branch'e push yapılmalı- Frontend değişikliklerinde branch'e push yapılmalı

