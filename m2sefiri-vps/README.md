# Metin2 Sefiri — Forum Platformu

Production-ready, full-stack forum yazılımı. **React + Node.js (Express) + MongoDB Atlas** stack.

## 📦 Özellikler

- ✅ JWT tabanlı üyelik / giriş / oturum yönetimi
- ✅ Bcrypt şifre hashleme (cost=12)
- ✅ Kategori → Alt forum → Konu → Yorum hiyerarşisi
- ✅ VİP / Pin / Lock konu özellikleri
- ✅ Admin paneli (kullanıcı, konu, yorum, reklam yönetimi)
- ✅ Reklam başvuru sistemi
- ✅ Rütbe sistemi (7 seviye, post sayısına göre)
- ✅ Forum istatistikleri
- ✅ Mongoose ODM + index'lenmiş sorgular
- ✅ Helmet, CORS, rate limiting, mongo-sanitize, HPP — güvenlik sıkılaştırması
- ✅ Express-validator ile input validation
- ✅ PM2 cluster mode + Nginx reverse proxy + Let's Encrypt SSL
- ✅ Mobil uyumlu modern arayüz

## 🗂️ Proje Yapısı

```
m2sefiri-vps/
├── backend/                    # Node.js + Express API
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── ecosystem.config.js     # PM2 config
│   └── src/
│       ├── config/             # DB + ortam config
│       ├── middleware/         # auth, admin, ratelimit, errorHandler
│       ├── models/             # Mongoose modelleri
│       ├── routes/             # REST endpoint'leri
│       └── utils/              # JWT, seed scripti
├── frontend/                   # React (Create React App + Craco)
│   ├── src/
│   ├── public/
│   └── .env.example
├── nginx/
│   └── metin2sefiri.conf       # Nginx reverse proxy config
└── README.md
```

---

## 🚀 Hızlı Başlangıç (Geliştirme)

### Ön koşullar

- Node.js ≥ 18
- MongoDB Atlas hesabı (ücretsiz M0 yeterli) — [hesap aç](https://www.mongodb.com/cloud/atlas/register)
- Git

### 1· Repo'yu klonla

```bash
git clone https://github.com/KULLANICI/Metin2Up.git
cd Metin2Up
```

### 2· Backend

```bash
cd backend
cp .env.example .env
# .env dosyasını aç ve MONGO_URI, JWT_SECRET, ADMIN_PASSWORD'ı gerçek değerlerle değiştir
nano .env

npm install
npm run dev          # nodemon ile geliştirme
# veya
npm start            # production modu
```

Açık olduğunda http://localhost:5000/api/health endpoint'i `{ ok: true }` dönmeli.

### 3· Frontend

```bash
cd ../frontend
cp .env.example .env
# .env'i aç, REACT_APP_BACKEND_URL=http://localhost:5000 olarak ayarla
nano .env

npm install
npm start            # http://localhost:3000
```

Varsayılan admin: `admin` / `ChangeThisStrongPassword123!` (`.env`'deki değerleri kullan).

---

## 🌐 MongoDB Atlas Kurulumu

1. https://www.mongodb.com/cloud/atlas/register → ücretsiz hesap aç
2. **Build a Database** → **M0 FREE** tier → bölge: Frankfurt (eu-central-1)
3. **Database Access** → **Add New Database User** → kullanıcı adı + güçlü şifre
4. **Network Access** → **Add IP Address** → `0.0.0.0/0` (veya VPS IP'si)
5. Cluster → **Connect** → **Drivers** → Node.js → connection string'i kopyala
6. Connection string'i `backend/.env` içindeki `MONGO_URI` değişkenine yapıştır:
   ```
   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/metin2sefiri?retryWrites=true&w=majority
   ```
   (`USER`, `PASSWORD`, `cluster0.xxxxx` kısımlarını kendi değerlerinle değiştir.)

---

## 📖 API Endpoint'leri

### Auth
| Method | Path | Auth | Açıklama |
|--------|------|------|---------|
| POST | `/api/auth/register` | - | Yeni üyelik (username, email, password) |
| POST | `/api/auth/login` | - | Giriş → JWT token |
| GET  | `/api/auth/me` | ✅ | Mevcut kullanıcı |
| POST | `/api/auth/change-password` | ✅ | Şifre değiştirme |

### Forum
| Method | Path | Açıklama |
|--------|------|---------|
| GET | `/api/categories` | Tüm kategori + alt forum + son gönderi |
| GET | `/api/categories/subforums/:slug?page=1` | Alt forum + sayfalı konu listesi |
| GET | `/api/topics/vip` | VİP konular |
| GET | `/api/topics?filter=upcoming` | Filtreli konu listesi |
| GET | `/api/topics/:id` | Konu + yorumlar |
| POST | `/api/topics` (auth) | Yeni konu oluştur |
| POST | `/api/topics/:id/replies` (auth) | Yorum yaz |

### Diğerleri
| Method | Path | Açıklama |
|--------|------|---------|
| GET | `/api/stats` | Forum istatistikleri |
| GET | `/api/ranks` | Rütbe listesi |
| GET | `/api/users/:username` | Profil bilgisi |
| POST | `/api/ads/apply` | Reklam başvurusu |

### Admin (auth + admin gerekli)
| Method | Path | Açıklama |
|--------|------|---------|
| GET | `/api/admin/stats` | Admin dashboard sayıları |
| GET/PATCH/DELETE | `/api/admin/users[/:id]` | Kullanıcı yönetimi |
| GET/PATCH/DELETE | `/api/admin/ads[/:id]` | Reklam başvuruları |
| GET/PATCH/DELETE | `/api/admin/topics[/:id]` | Konu yönetimi (pin/lock/vip) |
| DELETE | `/api/admin/replies/:id` | Yorum sil |
| POST/PATCH/DELETE | `/api/admin/categories[/:id]` | Kategori yönetimi |

---

## 🖥️ VPS Production Deploy (Ubuntu 22.04+ / Debian 11+)

### Adım 1 — Sunucu hazırlık

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx certbot python3-certbot-nginx ufw

# Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 global
sudo npm install -g pm2

# Güvenlik duvarı
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### Adım 2 — Proje deploy

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone https://github.com/KULLANICI/Metin2Up.git metin2sefiri
cd metin2sefiri
```

### Adım 3 — Backend

```bash
cd /var/www/metin2sefiri/backend
cp .env.example .env
nano .env
# Güncellenecekler:
#   NODE_ENV=production
#   PORT=5000
#   MONGO_URI=mongodb+srv://... (Atlas connection string)
#   JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")
#   CORS_ORIGINS=https://metin2sefiri.com,https://www.metin2sefiri.com
#   ADMIN_PASSWORD=KENDI_GUCLU_SIFREN

npm ci --omit=dev   # Sadece production paketleri
mkdir -p logs
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd      # Çıktıdaki komutu kopyalayıp çalıştır (sudo'lu)
```

Doğrula: `pm2 status` ve `curl http://localhost:5000/api/health`

### Adım 4 — Frontend build

```bash
cd /var/www/metin2sefiri/frontend
cp .env.example .env
nano .env
# REACT_APP_BACKEND_URL=https://metin2sefiri.com

npm ci
npm run build
# build/ klasörü Nginx tarafından servis edilecek
```

### Adım 5 — Nginx

```bash
sudo cp /var/www/metin2sefiri/nginx/metin2sefiri.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/metin2sefiri.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Konfigürasyondaki `metin2sefiri.com` ifadelerini kendi domain'inle değiştir:
sudo nano /etc/nginx/sites-available/metin2sefiri.conf

sudo nginx -t                  # Sentaks kontrolü
sudo systemctl reload nginx
```

### Adım 6 — SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d metin2sefiri.com -d www.metin2sefiri.com
sudo systemctl status certbot.timer   # Otomatik yenileme aktif
```

### Adım 7 — Güncelleme iş akışı (sonradan)

```bash
cd /var/www/metin2sefiri
git pull origin main

# Backend
cd backend && npm ci --omit=dev && pm2 reload metin2sefiri-api

# Frontend
cd ../frontend && npm ci && npm run build
```

---

## 🔍 Yararlı Komutlar

```bash
# Backend logları
pm2 logs metin2sefiri-api
pm2 logs metin2sefiri-api --lines 200

# PM2 monitoring
pm2 monit

# Yeniden başlat
pm2 restart metin2sefiri-api
pm2 reload metin2sefiri-api   # Zero-downtime

# Nginx logları
sudo tail -f /var/log/nginx/metin2sefiri.error.log
sudo tail -f /var/log/nginx/metin2sefiri.access.log

# Seed (ilk kurulumda otomatik çalışır, manuel de tetiklenebilir)
cd /var/www/metin2sefiri/backend && npm run seed
```

---

## 🔐 Güvenlik Notları

1. **`.env`** dosyasını ASLA git'e commit'leme. `.gitignore`'da zaten yok sayılıyor.
2. **JWT_SECRET** en az 48 karakter rastgele olsun:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
3. **Admin şifresi** ilk girişte değiştir: API üzerinden `/api/auth/change-password`.
4. **MongoDB Atlas IP whitelist**'i daraltmayı unutma (`0.0.0.0/0` yerine VPS IP'si).
5. Production'da `TRUST_PROXY=1` ayarlı — Nginx X-Forwarded-For header'ı doğru parse edilir.
6. **Rate limit**: `/api/auth` daha sıkı (15 dk ü 10 deneme), genel `/api/` 15 dk ü 300 istek.
7. Periyodik MongoDB Atlas backup al — M0 ücretsiz katmanda otomatik yedek yok.

---

## ⚖️ Lisans

MIT — Özgürce kullan, fork'la, geliştir.

## ✉️ İletişim

Discord: discord.gg/metin2sefiri
