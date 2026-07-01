function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ detail: 'Yetkilendirme gerekli' });
  if (!req.user.is_admin) return res.status(403).json({ detail: 'Admin yetkisi gerekli' });
  next();
}

module.exports = { requireAdmin };
