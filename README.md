# Çiçek CRM

Çiçek satış ve teslimat yönetim sistemi.

## Teknolojiler

- Frontend: HTML, JavaScript, Bootstrap 5
- Backend: Cloudflare Workers (TypeScript)
- Veritabanı: Cloudflare D1 (SQLite)

## Özellikler

### Müşteri Yönetimi
- Müşteri kayıt ve düzenleme
- Kurumsal/bireysel müşteri ayrımı
- Müşteri sipariş geçmişi

### Sipariş Yönetimi
- Siparişleri listeleme ve filtreleme
- Sipariş durumu takibi (Yeni > Hazırlanıyor > Hazır > Yolda > Teslim Edildi)
- Alıcı ve gönderen bilgileri ayrı kayıt
- Kart mesajı ve özel notlar
- Sipariş ürünleri ve fiyatlandırma

### Stok ve Ürün
- Ürün kategorileri
- Stok takibi ve minimum stok uyarıları
- Ürün alış/satış fiyatları

### Teslimat
- Teslimat adresi ve zaman dilimi seçimi
- Teslimat bölgesi bazlı fiyatlandırma
- Teslimat durumu takibi

### Raporlama
- Günlük/aylık satış raporları
- Kar marjı takibi
- Teslimat yoğunluk analizi

## Kurulum

1. Gerekli paketlerin yüklenmesi:
```bash
npm install
```

2. Veritabanı kurulumu:
```bash
cat schema.sql | wrangler d1 execute CicekCRM --file=-
```

3. Worker API'nin deploy edilmesi:

cd workers/api
wrangler deploy

4. git push 

git add .
git commit -m "xxx"
git push origin development

## Geliştirme Notları

### Veritabanı Yapısı
- Müşteriler (customers)
- Siparişler (orders)
- Ürünler (products)
- Ürün kategorileri (product_categories)
- Sipariş kalemleri (order_items)
- Tedarikçiler (suppliers)
- Tedarikçi siparişleri (purchase_orders)

### API Endpoints
- /orders: Sipariş yönetimi
- /customers: Müşteri yönetimi
- /products: Ürün yönetimi
- /api/dashboard: Dashboard istatistikleri
- /api/finance/stats: Finansal istatistikler

### Frontend Modülleri
- Sipariş listesi (/orders)
- Sipariş detay modalı
- Durum güncelleme dropdown'ı
- Tarih ve durum filtreleri
- Sayfalama sistemi

## Güvenlik

- CORS politikaları yapılandırıldı
- API erişim kontrolleri eklendi
- Veritabanı foreign key kısıtlamaları aktif

## Planlanan Geliştirmeler

- [ ] Teslimat bölgesi harita entegrasyonu
- [ ] SMS/Email bildirim sistemi
- [ ] Mobil uygulama
- [ ] Müşteri portalı
- [ ] Tedarikçi portalı


