/**
 * Centralized configuration
 */

const parseTrustProxy = (val) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  const n = parseInt(val, 10);
  if (!isNaN(n)) return n;
  return 1;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    email: process.env.ADMIN_EMAIL || 'admin@metin2sefiri.local',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '300', 10),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  },

  trustProxy: parseTrustProxy(process.env.TRUST_PROXY || '1'),
};
