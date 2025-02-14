# MacBook Terminal Komutları

## Temel Terminal Komutları
```bash
pwd                         # Mevcut dizin
ls -la                     # Tüm dosyaları detaylı listele
ls -R                      # Alt klasörlerle birlikte listele
cd ~/Downloads             # Downloads klasörüne git
cd -                      # Önceki klasöre dön
clear                     # Ekranı temizle
history                   # Komut geçmişi
!!                        # Son komutu tekrarla
```

## Dosya ve Klasör İşlemleri
```bash
mkdir -p folder1/folder2   # İç içe klasör oluştur
touch file.txt            # Boş dosya oluştur
cp -R folder1 folder2     # Klasörü kopyala
mv file1 file2           # Dosya taşı/yeniden adlandır
rm -rf folder            # Klasörü zorla sil
find . -name "*.js"      # .js dosyalarını bul
grep "text" file         # Dosyada metin ara
zip -r archive.zip folder # Klasörü sıkıştır
unzip archive.zip        # Arşivi aç
```

## Sistem Komutları
```bash
top                      # İşlem monitörü
htop                     # Gelişmiş işlem monitörü
ps aux                   # Tüm işlemleri listele
kill -9 PID             # İşlemi sonlandır
df -h                   # Disk kullanımı
du -sh *                # Klasör boyutları
free -m                 # Bellek kullanımı
system_profiler         # Sistem bilgisi
sysctl -n machdep.cpu.brand_string # CPU bilgisi
```

## Ağ Komutları
```bash
ping google.com         # Ping at
traceroute google.com   # Rotayı göster
netstat -an | grep LISTEN # Açık portlar
curl -I URL            # HTTP başlıkları
wget -c URL            # Dosya indir (devam etme özellikli)
ssh user@host          # SSH bağlantısı
scp file user@host:path # Uzak sunucuya dosya kopyala
```

## Dosya İzinleri ve Sahiplik
```bash
chmod 755 file         # İzinleri ayarla (rwxr-xr-x)
chmod +x file         # Çalıştırma izni ver
chown user:group file # Sahiplik değiştir
stat file            # Dosya detayları
```

## Disk ve Backup
```bash
diskutil list         # Diskleri listele
diskutil unmount /dev/disk2 # Diski çıkar
dd if=/dev/disk2 of=backup.img # Disk imajı al
rsync -av source/ dest/ # Senkronize et
```

## Brew (Paket Yöneticisi)
```bash
brew update           # Brew'i güncelle
brew install package  # Paket kur
brew list            # Kurulu paketler
brew upgrade         # Tüm paketleri güncelle
brew cleanup         # Temizlik yap
```

## MacOS Özel
```bash
softwareupdate --list # Güncellemeleri listele
caffeinate           # Uykuya geçmeyi engelle
screencapture -c     # Ekran görüntüsü al
pbcopy < file        # Dosyayı panoya kopyala
pbpaste > file       # Panodan dosyaya yapıştır
open -a "App"        # Uygulama aç
osascript -e 'tell application "App" to quit' # Uygulama kapat
```

## Geliştirici Araçları
```bash
xcode-select --install # Xcode araçlarını kur
gcc --version        # GCC versiyonu
python3 --version    # Python versiyonu
node --version      # Node.js versiyonu
npm list -g --depth=0 # Global NPM paketleri
```

## Terminal Özelleştirme
```bash
echo 'alias ll="ls -la"' >> ~/.zshrc # Alias ekle
source ~/.zshrc      # Konfig dosyasını yenile
echo $PATH           # PATH değişkenini gör
echo $SHELL          # Aktif shell'i gör
```