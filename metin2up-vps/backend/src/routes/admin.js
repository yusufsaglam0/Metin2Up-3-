const express = require('express');
const mongoose = require('mongoose');
const { body, query } = require('express-validator');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Reply = require('../models/Reply');
const AdApplication = require('../models/AdApplication');
const Category = require('../models/Category');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All admin routes require auth + admin
router.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/stats - Admin dashboard stats.
 */
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, topics, replies, adsPending, adsTotal, admins, verifiedUsers, banned] = await Promise.all([
      User.countDocuments(),
      Topic.countDocuments(),
      Reply.countDocuments(),
      AdApplication.countDocuments({ status: 'pending' }),
      AdApplication.countDocuments(),
      User.countDocuments({ isAdmin: true }),
      User.countDocuments({ verified: true }),
      User.countDocuments({ isBanned: true }),
    ]);
    res.json({ users, topics, replies, adsPending, adsTotal, admins, verifiedUsers, banned });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/users
 */
router.get(
  '/users',
  [query('limit').optional().isInt({ min: 1, max: 500 })],
  validate,
  async (req, res, next) => {
    try {
      const limit = Math.min(500, parseInt(req.query.limit, 10) || 100);
      const q = {};
      if (req.query.q) {
        const re = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        q.$or = [{ username: re }, { email: re }];
      }
      const users = await User.find(q).sort({ createdAt: -1 }).limit(limit).lean();
      res.json(users.map((u) => ({ ...u, id: u._id.toString(), _id: undefined, passwordHash: undefined })));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/users/:id
 */
router.patch(
  '/users/:id',
  [
    body('verified').optional().isBoolean(),
    body('isAdmin').optional().isBoolean(),
    body('isBanned').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Geçersiz id' });
      const update = {};
      ['verified', 'isAdmin', 'isBanned'].forEach((f) => {
        if (typeof req.body[f] === 'boolean') update[f] = req.body[f];
      });
      if (Object.keys(update).length === 0) return res.status(400).json({ error: 'Boş güncelleme' });
      const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
      if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      res.json(user.toJSON());
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/admin/users/:id
 */
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.userId) return res.status(400).json({ error: 'Kendi hesabını silemezsin' });
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ ok: true, deletedUser: u.username });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/ads
 */
router.get('/ads', async (req, res, next) => {
  try {
    const q = {};
    if (['pending', 'approved', 'rejected'].includes(req.query.status)) q.status = req.query.status;
    const ads = await AdApplication.find(q).sort({ createdAt: -1 }).limit(500).lean();
    res.json(ads.map((a) => ({ ...a, id: a._id.toString(), _id: undefined })));
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/ads/:id
 */
router.patch(
  '/ads/:id',
  [body('status').isIn(['pending', 'approved', 'rejected'])],
  validate,
  async (req, res, next) => {
    try {
      const ad = await AdApplication.findByIdAndUpdate(
        req.params.id,
        { $set: { status: req.body.status } },
        { new: true }
      );
      if (!ad) return res.status(404).json({ error: 'Başvuru bulunamadı' });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/ads/:id', async (req, res, next) => {
  try {
    const r = await AdApplication.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Başvuru bulunamadı' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/topics
 */
router.get('/topics', async (req, res, next) => {
  try {
    const limit = Math.min(500, parseInt(req.query.limit, 10) || 100);
    const topics = await Topic.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json(topics.map((t) => ({ ...t, id: t._id.toString(), _id: undefined })));
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/topics/:id
 */
router.delete('/topics/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Geçersiz id' });
    const t = await Topic.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ error: 'Konu bulunamadı' });
    await Reply.deleteMany({ topicId: t._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/admin/topics/:id - pin/lock/vip toggle
 */
router.patch(
  '/topics/:id',
  [
    body('isPinned').optional().isBoolean(),
    body('isLocked').optional().isBoolean(),
    body('isVip').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const update = {};
      ['isPinned', 'isLocked', 'isVip'].forEach((f) => {
        if (typeof req.body[f] === 'boolean') update[f] = req.body[f];
      });
      if (Object.keys(update).length === 0) return res.status(400).json({ error: 'Boş güncelleme' });
      const t = await Topic.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
      if (!t) return res.status(404).json({ error: 'Konu bulunamadı' });
      res.json(t.toJSON());
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/admin/replies/:id
 */
router.delete('/replies/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Geçersiz id' });
    const r = await Reply.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Cevap bulunamadı' });
    await Topic.updateOne({ _id: r.topicId }, { $inc: { repliesCount: -1 } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/categories - create category
 */
router.post(
  '/categories',
  [
    body('slug').isString().trim().notEmpty(),
    body('title').isString().trim().notEmpty(),
    body('description').optional().isString(),
    body('icon').optional().isString(),
    body('order').optional().isInt(),
    body('subForums').optional().isArray(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const cat = await Category.create(req.body);
      res.status(201).json(cat.toJSON());
    } catch (err) {
      next(err);
    }
  }
);

router.patch('/categories/:id', async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!cat) return res.status(404).json({ error: 'Kategori bulunamadı' });
    res.json(cat.toJSON());
  } catch (err) {
    next(err);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Kategori bulunamadı' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
