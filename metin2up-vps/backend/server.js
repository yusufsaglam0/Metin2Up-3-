/**
 * Metin2UP - Express server entry point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const config = require('./src/config');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const { generalLimiter } = require('./src/middleware/rateLimit');
const seed = require('./src/utils/seed');

// Route imports
const authRoutes = require('./src/routes/auth');
const categoryRoutes = require('./src/routes/categories');
const topicRoutes = require('./src/routes/topics');
const statsRoutes = require('./src/routes/stats');
const rankRoutes = require('./src/routes/ranks');
const adRoutes = require('./src/routes/ads');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');

const app = express();

// Trust proxy (for Nginx)
if (config.trustProxy !== false) app.set('trust proxy', config.trustProxy);

// Security middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(mongoSanitize());
app.use(hpp());

// CORS
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed for origin: ' + origin));
  },
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Compression + logging
app.use(compression());
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Global rate limit
app.use('/api/', generalLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'metin2up-api', env: config.nodeEnv, ts: new Date().toISOString() });
});

app.get('/api', (_req, res) => {
  res.json({ message: 'Metin2UP API', version: '1.0.0' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ranks', rankRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint bulunamadı', path: req.originalUrl });
});

// Global error handler
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    await seed();
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`✓ Metin2UP API ${config.nodeEnv} mode on port ${config.port}`);
    });
    const shutdown = (sig) => {
      console.log(`\n[${sig}] kapanıyor...`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('Başlatma hatası:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
