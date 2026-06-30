const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post(
  '/register',
  authLimiter,
  [
    body('username').isString().trim().isLength({ min: 3, max: 24 }).matches(/^[a-zA-Z0-9_.-]+$/),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 64 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const exists = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
      if (exists) {
        return res.status(409).json({ detail: 'Kullanıcı adı veya e-posta zaten kullanılıyor' });
      }
      const user = new User({ username, email });
      await user.setPassword(password);
      await user.save();
      const token = signToken(user);
      return res.status(201).json({ token, user: user.toJSON() });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  authLimiter,
  [
    body('username').isString().trim().notEmpty(),
    body('password').isString().notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        $or: [{ username }, { email: username.toLowerCase() }],
      }).select('+password_hash');
      if (!user) return res.status(401).json({ detail: 'Kullanıcı adı veya şifre hatalı' });
      if (user.is_banned) return res.status(403).json({ detail: 'Hesabınız askıya alınmış' });
      const ok = await user.verifyPassword(password);
      if (!ok) return res.status(401).json({ detail: 'Kullanıcı adı veya şifre hatalı' });
      user.last_login_at = new Date();
      await user.save();
      const token = signToken(user);
      return res.json({ token, user: user.toJSON() });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user.toJSON());
});

/**
 * POST /api/auth/change-password
 */
router.post(
  '/change-password',
  requireAuth,
  [body('current_password').isString().notEmpty(), body('new_password').isString().isLength({ min: 6, max: 64 })],
  validate,
  async (req, res, next) => {
    try {
      const { current_password, new_password } = req.body;
      const user = await User.findById(req.userId).select('+password_hash');
      if (!user) return res.status(404).json({ detail: 'Kullanıcı bulunamadı' });
      const ok = await user.verifyPassword(current_password);
      if (!ok) return res.status(401).json({ detail: 'Mevcut şifre hatalı' });
      await user.setPassword(new_password);
      await user.save();
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
