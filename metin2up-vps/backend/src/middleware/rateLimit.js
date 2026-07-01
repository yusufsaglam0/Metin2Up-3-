const rateLimit = require('express-rate-limit');
const config = require('../config');

const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Çok fazla istek. Lütfen sonra tekrar deneyin.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' },
  skipSuccessfulRequests: true,
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Çok hızlı gönderim. Lütfen yavaşlayın.' },
});

module.exports = { generalLimiter, authLimiter, writeLimiter };
