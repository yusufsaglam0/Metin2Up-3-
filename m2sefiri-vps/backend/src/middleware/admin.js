/**
 * Admin middleware - require user to be admin.
 * MUST be used AFTER requireAuth.
 */
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Yetkilendirme gerekli' });
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin yetkisi gerekli' });
  next();
}

module.exports = { requireAdmin };
