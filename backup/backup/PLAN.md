# Çiçek CRM Projesi

## Amaç
Çiçekçiler için kapsamlı yönetim sistemi

## Teknik Stack - Cloudflare Ekosistemi

### Frontend
- HTML + Vanilla JavaScript
- Tailwind CSS (CDN)
- htmx (AJAX işlemleri için)

### Backend & Database
- Cloudflare Workers (Edge Functions)
- Cloudflare D1 (SQLite tabanlı)
- Cloudflare Pages (Hosting)

## API Endpoints (Cloudflare Workers)

### Takvim
- GET /api/calendar - Tüm teslimatların takvim görünümü
- GET /api/calendar/day/:date - Belirli bir günün teslimatları
- GET /api/calendar/week/:date - Haftalık teslimat görünümü
- GET /api/calendar/month/:date - Aylık teslimat görünümü
- GET /api/calendar/status/:status - Duruma göre teslimatlar (new, preparing, delivering, delivered)

### Müşteriler
- GET /api/customers - Müşteri listesi
- POST /api/customers - Yeni müşteri
- PUT /api/customers/:id - Müşteri güncelleme
- GET /api/customers/:id - Müşteri detay

### Siparişler
- GET /api/orders - Sipariş listesi
- POST /api/orders - Yeni sipariş
- PUT /api/orders/:id - Sipariş güncelleme
- GET /api/orders/:id - Sipariş detay

### Ürünler
- GET /api/products - Ürün listesi
- POST /api/products - Yeni ürün
- PUT /api/products/:id - Ürün güncelleme
- GET /api/products/:id - Ürün detay

### Tedarikçiler
- GET /api/suppliers - Tedarikçi listesi
- POST /api/suppliers - Yeni tedarikçi
- PUT /api/suppliers/:id - Tedarikçi güncelleme

## Sayfalar (Cloudflare Pages)

### Takvim (/calendar)
- Aylık/Haftalık/Günlük teslimat takvimi
- Renk kodlu sipariş durumları:
  - Kırmızı: Hazırlanıyor
  - Sarı: Yolda
  - Yeşil: Teslim edildi
  - Gri: İptal edildi
- Drag & Drop ile teslimat zamanı güncelleme
- Gün bazında teslimat yoğunluğu görünümü
- Saat dilimi bazlı teslimat listesi
- Hızlı durum güncelleme
- Teslimat rotası planlaması

### Dashboard (/)
- Günlük teslimatlar
- Stok uyarıları
- Son siparişler
- Finansal özet

### Müşteriler (/customers)
- Müşteri listesi
- Müşteri kayıt/düzenleme
- Müşteri detay görünümü
- Müşteri sipariş geçmişi

### Siparişler (/orders)
- Sipariş listesi
- Yeni sipariş oluşturma
- Sipariş takip
- Teslimat planlama

### Ürün Yönetimi (/products)
- Ürün listesi
- Stok takibi
- Fiyat güncelleme
- Kategori yönetimi

### Tedarikçiler (/suppliers)
- Tedarikçi listesi
- Satın alma siparişleri
- Stok girişi

### Raporlar (/reports)
- Satış raporları
- Stok raporları
- Müşteri analizleri
- Finansal raporlar

## Geliştirme Sırası
1. Worker API endpoints
2. Takvim altyapısı ve API'leri
3. HTML sayfaları ve formlar
4. htmx ile frontend entegrasyonu
5. Raporlama sistemi