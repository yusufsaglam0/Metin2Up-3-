const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

function extractToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ detail: 'Yetkilendirme gerekli' });
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ detail: 'Kullanıcı bulunamadı' });
    if (user.is_banned) return res.status(403).json({ detail: 'Hesabınız askıya alınmış' });
    req.user = user;
    req.userId = String(user._id);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ detail: 'Oturum süresi doldu' });
    return res.status(401).json({ detail: 'Geçersiz token' });
  }
}

async function optionalAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
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
