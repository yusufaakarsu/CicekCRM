# Wrangler Komutları

## Worker Komutları
```bash
# Geliştirme
wrangler dev                           # Geliştirme sunucusu başlat
wrangler dev --local                   # Yerel geliştirme
wrangler dev --remote                  # Uzak geliştirme

# Deploy
wrangler deploy                        # Worker'ı deploy et
wrangler deploy --env production       # Production ortamına deploy
wrangler deploy --dry-run             # Test deploy

# Worker Yönetimi
wrangler whoami                        # Giriş bilgisi
wrangler logout                        # Çıkış yap
wrangler init [name]                   # Yeni proje oluştur
```

## D1 Veritabanı Komutları
```bash
# Veritabanı Oluşturma
wrangler d1 create <DB_NAME>          # Yeni DB oluştur
wrangler d1 list                      # DB'leri listele
wrangler d1 delete <DB_NAME>          # DB sil

# SQL İşlemleri
wrangler d1 execute <DB_NAME> --command "SQL_QUERY"     # SQL çalıştır
wrangler d1 execute <DB_NAME> --file=./schema.sql       # SQL dosyası çalıştır
wrangler d1 backup <DB_NAME>          # Yedek al
wrangler d1 restore <DB_NAME>         # Yedekten geri yükle

# Geliştirme İşlemleri
wrangler d1 execute <DB_NAME> --local # Yerel DB'de çalıştır
wrangler d1 execute <DB_NAME> --remote # Uzak DB'de çalıştır
```

## KV (Key-Value) Komutları
```bash
# Namespace İşlemleri
wrangler kv:namespace create <NAME>    # Namespace oluştur
wrangler kv:namespace list            # Namespace'leri listele
wrangler kv:namespace delete <ID>     # Namespace sil

# Veri İşlemleri
wrangler kv:key put <KEY> <VALUE>     # Değer ekle
wrangler kv:key get <KEY>             # Değer oku
wrangler kv:key delete <KEY>          # Değer sil
wrangler kv:bulk put <FILE>           # Toplu veri ekle
```

## Secrets Yönetimi
```bash
# Secret İşlemleri
wrangler secret put <NAME>            # Secret ekle
wrangler secret list                  # Secret'ları listele
wrangler secret delete <NAME>         # Secret sil

# Environment Variables
wrangler secret put <NAME> --env production  # Production secret
wrangler secret put <NAME> --env staging     # Staging secret
```

## Proje Yapılandırması
```bash
# wrangler.toml İşlemleri
wrangler init                         # Yapılandırma oluştur
wrangler build                        # Projeyi derle
wrangler tail                        # Log takibi
wrangler publish                     # Yayınla

# Özel Domain
wrangler publish --custom-domain example.com  # Domain ile yayınla
```

## Worker Geliştirme
```bash
# TypeScript Worker
wrangler generate <NAME> https://github.com/cloudflare/worker-typescript-template

# Modules
wrangler add package <NAME>           # Paket ekle
wrangler remove package <NAME>        # Paket kaldır

# Testing
wrangler test                        # Testleri çalıştır
```
