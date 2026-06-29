const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/**
 * Extract JWT from Authorization header.
 */
function extractToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

/**
 * Required auth: 401 if missing/invalid.
 */
async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    req.user = user;
    req.userId = String(user._id);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Oturum süresi doldu' });
    return res.status(401).json({ error: 'Geçersiz token' });
  }
}

/**
 * Optional auth: attaches req.user if token valid, otherwise continues.
 */
async function optionalAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (user) {
      req.user = user;
      req.userId = String(user._id);
    }
  } catch (_) {
    // ignore
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
