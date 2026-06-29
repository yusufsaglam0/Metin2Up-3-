/**
 * Seed initial data: categories, subforums, ranks, admin user, sample topics.
 * Idempotent - safe to call multiple times.
 */

const Category = require('../models/Category');
const Rank = require('../models/Rank');
const User = require('../models/User');
const Topic = require('../models/Topic');
const config = require('../config');

const SEED_CATEGORIES = [
  {
    slug: 'emek', order: 1, icon: 'sparkles',
    title: 'Metin2 Emek Server Kategorisi',
    description: 'Ücretsiz Konu Paylaşım Alanıdır.',
    subForums: [
      { slug: 'sf-1-105', name: '1-105 Metin2 Serverler', description: '1-105 Sunucuları içeriden takip edebilirsiniz.' },
      { slug: 'sf-1-120', name: '1-120 Metin2 Serverler', description: '1-120 Sunucuları içeriden takip edebilirsiniz.' },
      { slug: 'sf-1-99', name: '1-99 Metin2 Serverler', description: '1-99 Sunucuları içeriden takip edebilirsiniz.' },
      { slug: 'sf-global', name: 'Metin2 Global Serverler', description: 'You can follow Global servers from the inside.' },
    ],
  },
  {
    slug: 'kolay', order: 2, icon: 'lightning',
    title: 'Metin2 Kolay Server Kategorisi',
    description: 'Ücretsiz Konu Paylaşım Alanıdır.',
    subForums: [
      { slug: 'sf-55-120', name: '55-120 Metin2 Serverler', description: '55-120 Sunucuları içeriden takip edebilirsiniz.' },
      { slug: 'sf-65-250', name: '65-250 Metin2 Serverler', description: '65-250 Sunucuları içeriden takip edebilirsiniz.' },
      { slug: 'sf-wslik', name: 'Wslik Metin2 Serverler', description: 'Wslik Sunucuları içeriden takip edebilirsiniz.' },
      { slug: 'sf-farm', name: 'Farm Metin2 Serverler', description: 'Farm odaklı sunucular için tanıtım alanı.' },
    ],
  },
  {
    slug: 'hata', order: 3, icon: 'tools',
    title: 'Hata Çözümleri ve Destek',
    description: 'Hata Çözümleri ve Destek Paylaşım Alanı.',
    subForums: [
      { slug: 'sf-diger', name: 'Diğer Çözümler', description: 'Diğer hata ve çözüm paylaşım alanı.' },
      { slug: 'sf-hatalar', name: 'Hata Çözümleri', description: 'Hata Çözümleri Paylaşım Alanı.' },
      { slug: 'sf-client', name: 'Client Hataları', description: 'Metin2 client hataları ve çözümleri.' },
    ],
  },
  {
    slug: 'genel', order: 4, icon: 'globe',
    title: 'Metin2 Genel',
    description: 'Metin2 ile ilgili genel paylaşım alanı.',
    subForums: [
      { slug: 'sf-grafik', name: 'Grafik - Tasarım - Video', description: 'Tasarımcı Paylaşım Alanı.' },
      { slug: 'sf-lonca', name: 'Lonca Tanıtımı', description: 'Metin2 Lonca Tanıtım Bölgesi.' },
      { slug: 'sf-sohbet', name: 'Metin Sohbet - Tartışma Alanı', description: 'Metin2 Sohbet ve Tartışma Konu Alanı.' },
      { slug: 'sf-wiki', name: 'Metin2 Wiki & Oyun Kılavuzu', description: 'Metin2 oyuncuları için görevler, itemler, farm rehberi.' },
    ],
  },
  {
    slug: 'developer', order: 5, icon: 'code',
    title: 'Metin2 Developer Kategorisi',
    description: 'Metin2 geliştirici köşesi.',
    subForums: [
      { slug: 'sf-python', name: 'C++ / C# / Python Kodlama', description: 'C++ / C# / Python kodlama paylaşım alanı.' },
      { slug: 'sf-gm', name: 'Metin2 GM Kodları', description: 'Metin2 GM Kodlarına Burdan Bakabilirsiniz.' },
      { slug: 'sf-quest', name: 'Metin2 PvP Quest Paylaşımları', description: 'Metin2 PvP Quest Konu Alanı.' },
      { slug: 'sf-files', name: 'Metin2 PvP Serverler Files', description: 'Metin2 PvP Serverler Files Kategori Alanı.' },
    ],
  },
  {
    slug: 'eklenti', order: 6, icon: 'puzzle',
    title: 'Eklenti ve Sistem Paylaşımları',
    description: 'Metin2 içi eklenti ve sistem paylaşımları.',
    subForums: [
      { slug: 'sf-costume', name: 'Costume Sistemleri', description: 'Costume / kıyafet sistemleri paylaşımları.' },
      { slug: 'sf-item', name: 'Item & Mob Paylaşımları', description: 'Item ve mob paylaşım alanı.' },
      { slug: 'sf-map', name: 'Map Paylaşımları', description: 'Yeni harita paylaşım alanı.' },
    ],
  },
  {
    slug: 'ticaret', order: 7, icon: 'coin',
    title: 'Ticaret & Alım-Satım',
    description: 'Hesap, item ve hizmet ticaret alanı.',
    subForums: [
      { slug: 'sf-hesap', name: 'Hesap Alım-Satım', description: 'Metin2 hesap alım-satım alanı.' },
      { slug: 'sf-item-trade', name: 'Item Alım-Satım', description: 'Server içi item alım-satım alanı.' },
      { slug: 'sf-hizmet', name: 'Hizmet Alım-Satım', description: 'Geliştirici, tasarım ve diğer hizmetler.' },
    ],
  },
  {
    slug: 'video', order: 8, icon: 'video',
    title: 'Video ve Yayın Kanal Tanıtımları',
    description: 'İçerik Üreticisi İçin Açılmış Ücretsiz Konu Paylaşım alanıdır.',
    subForums: [
      { slug: 'sf-tiktok', name: 'Tiktok Kanalı Tanıtımları', description: 'Tiktok yayınızı tanıtın.' },
      { slug: 'sf-yt', name: 'Youtube Kanal Tanıtımları', description: 'Youtube yayınızı tanıtın.' },
      { slug: 'sf-twitch', name: 'Twitch / Kick Yayınları', description: 'Twitch ve Kick yayıncı tanıtım alanı.' },
    ],
  },
  {
    slug: 'uyeler', order: 9, icon: 'people',
    title: 'Üyelerimiz / Off-Topic',
    description: 'Forum üyeleri arası sohbet ve tanışma.',
    subForums: [
      { slug: 'sf-tanitim', name: 'Tanıtım Köşesi', description: 'Yeni üyeler kendini tanıtır.' },
      { slug: 'sf-offtopic', name: 'Off-Topic Sohbet', description: 'Metin2 dışı sohbet alanı.' },
      { slug: 'sf-oneri', name: 'Öneri & İstek', description: 'Forum ve site ile ilgili öneri & istekler.' },
    ],
  },
];

const SEED_RANKS = [
  { name: 'Ziyaretçi', minPosts: 0, color: '#6b7280', icon: 'user', description: 'Yeni katılan üyeler.' },
  { name: 'Çırak', minPosts: 5, color: '#9ca3af', icon: 'user', description: 'İlk adımlar.' },
  { name: 'Savaşçı', minPosts: 25, color: '#22c55e', icon: 'shield', description: 'Aktif üyelik.' },
  { name: 'Veteran', minPosts: 100, color: '#3b82f6', icon: 'star', description: 'Tecrübeli üye.' },
  { name: 'Usta', minPosts: 300, color: '#a855f7', icon: 'award', description: 'Topluluk üstünü.' },
  { name: 'Efsane', minPosts: 750, color: '#f59e0b', icon: 'crown', description: 'Forumun lideri.' },
  { name: 'Sefir', minPosts: 2000, color: '#ef4444', icon: 'crown', description: 'En üst seviye.' },
];

const SEED_TOPICS = [
  { sub: 'vip', title: 'Metin2 Sohbet Grubu – Facebook Grubu', content: 'Metin2 sohbet grubuna katılmak için tıklayın.', isVip: true, views: 874, repliesCount: 2, verified: true },
  { sub: 'sf-1-105', title: 'LotusMt2 1-105 Orta Emek açılıyor!', content: '27 Şubat’ta orta emek yapısı ile açılıyoruz.', views: 542, repliesCount: 12, verified: true },
  { sub: 'sf-1-120', title: 'Metius2 1-120 Mobil Oyun – 29 Mayıs', content: 'Mobil ve PC uyumlu 1-120 server.', views: 320, repliesCount: 8, verified: true },
  { sub: 'sf-wslik', title: 'VslikMt2 Hem Vslik/Farm Yapısı 19 Haziran', content: 'Vşlik + farm yapısı.', views: 780, repliesCount: 18, isNew: true },
  { sub: 'sf-diger', title: 'Metin2 Tüm SYSSER Hataları ve Çözümleri', content: 'SYSSER dosyalarındaki hatalar.', views: 1200, repliesCount: 24 },
  { sub: 'sf-wiki', title: 'Büyülü Orman ve Jotun Thrym Solo Kesim Rehberi', content: 'Solo kesim rehberi.', views: 520, repliesCount: 11 },
];

async function seed() {
  // Categories
  const catCount = await Category.estimatedDocumentCount();
  if (catCount === 0) {
    await Category.insertMany(SEED_CATEGORIES);
    console.log(`✓ ${SEED_CATEGORIES.length} kategori seed edildi`);
  }

  // Ranks
  const rankCount = await Rank.estimatedDocumentCount();
  if (rankCount === 0) {
    await Rank.insertMany(SEED_RANKS);
    console.log(`✓ ${SEED_RANKS.length} rütbe seed edildi`);
  }

  // Admin user (if no admin exists)
  const adminExists = await User.findOne({ isAdmin: true });
  if (!adminExists) {
    const u = new User({
      username: config.admin.username,
      email: config.admin.email,
      isAdmin: true,
      verified: true,
    });
    await u.setPassword(config.admin.password);
    await u.save();
    console.log(`✓ Admin '${config.admin.username}' oluşturuldu. SIFREYI DEGISTIRIN!`);
  }

  // Sample topics
  const topicCount = await Topic.estimatedDocumentCount();
  if (topicCount === 0) {
    const admin = await User.findOne({ isAdmin: true });
    if (admin) {
      for (const t of SEED_TOPICS) {
        await Topic.create({
          subForumSlug: t.sub,
          title: t.title,
          content: t.content,
          author: admin.username,
          authorId: admin._id,
          isVip: !!t.isVip,
          isNew: !!t.isNew,
          verified: !!t.verified,
          views: t.views || 0,
          repliesCount: t.repliesCount || 0,
          lastReplyAt: new Date(),
        });
      }
      console.log(`✓ ${SEED_TOPICS.length} örnek konu seed edildi`);
    }
  }
}

module.exports = seed;

// Allow running directly
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('../config/db');
  connectDB()
    .then(seed)
    .then(() => { console.log('Seed tamamlandı.'); process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); });
}
