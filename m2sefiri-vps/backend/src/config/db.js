const mongoose = require('mongoose');
const config = require('./index');

mongoose.set('strictQuery', true);

async function connectDB() {
  if (!config.mongoUri) {
    throw new Error('MONGO_URI environment değişkeni tanımlı değil. .env dosyasını kontrol et.');
  }
  mongoose.connection.on('connected', () => console.log('✓ MongoDB bağlandı'));
  mongoose.connection.on('error', (e) => console.error('MongoDB hatası:', e.message));
  mongoose.connection.on('disconnected', () => console.warn('! MongoDB bağlantısı kesildi'));

  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 20,
  });
  return mongoose.connection;
}

module.exports = connectDB;
