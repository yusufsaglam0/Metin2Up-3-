# Metin2 Sefiri – Statik Klon

## cPanel Yüklemesi

1. Tüm klasör içeriğini (`index.html`, `assets/`) cPanel `File Manager` üzerinden `public_html/` klasörüne yükleyin.
2. `index.html` otomatik açılacaktır. Hiçbir server-side işleme gerek yok.
3. Domain'e gidip kontrol edin.

## Dosya Yapısı

```
static-site/
├── index.html              # Ana sayfa
├── assets/
│   ├── css/style.css       # Tüm stiller
│   └── js/
│       ├── data.js         # Forum kategori verileri (düzenleyebilirsin)
│       └── main.js         # Render + etkileşim
└── README.md
```

## Düzenleme

- Kategori / konu listesini değiştirmek için `assets/js/data.js` dosyasını aç ve `forumData` dizisini düzenle.
- Renkleri / yazı tiplerini `assets/css/style.css` üzerindeki CSS değişkenlerinden değiştirebilirsin.
- Login formu sadece `localStorage`'a yazıyor (sahte oturum). Gerçek üyelik istersen PHP + MySQL ile genişletilebilir.

## Teknoloji

- Saf HTML5 + CSS3 + Vanilla JavaScript
- Bootstrap Icons CDN
- Google Fonts CDN (Cinzel & Inter)
- Backend yok. cPanel'in herhangi bir paketinde çalışır.
