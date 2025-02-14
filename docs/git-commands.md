# Git Komutları ve Kullanımları

## Temel Komutlar

```bash
git init                    # Yeni repo oluştur
git clone [url]            # Uzak repoyu klonla
git status                 # Değişiklikleri görüntüle
git add [dosya]           # Dosyayı staging'e ekle
git add .                 # Tüm değişiklikleri staging'e ekle
git commit -m "[mesaj]"   # Değişiklikleri commit'le
```

## Branch İşlemleri

```bash
git branch                # Branch'leri listele
git branch [isim]        # Yeni branch oluştur
git checkout [branch]    # Branch değiştir
git merge [branch]       # Mevcut branch'e başka branch'i merge et
git branch -d [branch]   # Branch sil
```

## Uzak Repo İşlemleri

```bash
git remote add origin [url]   # Uzak repo ekle
git push origin [branch]      # Branch'i uzak repoya gönder
git pull origin [branch]      # Uzak repodan değişiklikleri çek
git fetch                     # Uzak repo bilgilerini güncelle
```

## Değişiklik İşlemleri

```bash
git diff                  # Değişiklikleri göster
git diff --staged        # Stage'deki değişiklikleri göster
git log                  # Commit geçmişini göster
git reset [dosya]       # Dosyayı staging'den çıkar
git reset --hard HEAD   # Son commit'e geri dön
```

## Stash İşlemleri

```bash
git stash               # Değişiklikleri geçici kaydet
git stash pop          # Son stash'i geri yükle
git stash list         # Stash'leri listele
git stash drop        # Son stash'i sil
```

## Etiketleme

```bash
git tag                 # Etiketleri listele
git tag [etiket]       # Etiket oluştur
git tag -a [etiket]    # Açıklamalı etiket oluştur
```

## Çakışma Çözümü

```bash
git checkout --ours [dosya]    # Bizim değişiklikleri kabul et
git checkout --theirs [dosya]  # Diğer değişiklikleri kabul et
git add [dosya]               # Çözülen çakışmayı işaretle
```

## Geçmiş İşlemleri

```bash
git revert [commit]     # Commit'i geri al
git reset [commit]      # Belirtilen commit'e geri dön
git cherry-pick [commit] # Başka branch'den commit al
```

## Proje Özel Komutlar

```bash
# Development ortamı
git checkout development
git pull origin development
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin development

# Production'a deploy
git checkout main
git merge development
git push origin main
```

## Commit Mesaj Formatı

```bash
feat: yeni özellik
fix: hata düzeltmesi
docs: dokümantasyon değişikliği
style: kod formatı değişikliği
refactor: kod iyileştirmesi
test: test değişikliği
chore: genel düzenlemeler
```
