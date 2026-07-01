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

router.use(requireAuth, requireAdmin);

function userToResponse(u) {
  return {
    id: u._id ? u._id.toString() : u.id,
    username: u.username,
    email: u.email,
    avatar: u.avatar || '',
    verified: !!u.verified,
    is_admin: !!u.is_admin,
    is_seed: !!u.is_seed,
    is_banned: !!u.is_banned,
    post_count: u.post_count || 0,
    created_at: u.created_at,
    updated_at: u.updated_at,
  };
}

function topicToResponse(t) {
  return {
    id: t._id ? t._id.toString() : t.id,
    subforum_slug: t.subforum_slug,
    title: t.title,
    author: t.author,
    verified: !!t.verified,
    is_vip: !!t.is_vip,
    is_new: !!t.is_new,
    is_pinned: !!t.is_pinned,
    is_locked: !!t.is_locked,
    replies_count: t.replies_count || 0,
    views: t.views || 0,
    created_at: t.created_at,
  };
}

function adToResponse(a) {
  return {
    id: a._id ? a._id.toString() : a.id,
    name: a.name,
    contact: a.contact,
    message: a.message,
    ad_type: a.ad_type,
    status: a.status,
    created_at: a.created_at,
  };
}

/**
 * GET /api/admin/stats
 * Response: { users, admins, verified_users, topics, replies, ads_pending, ads_total }
 */
router.get('/stats', async (_req, res, next) => {
  try {
    const [users, topics, replies, adsPending, adsTotal, admins, verifiedUsers, banned] = await Promise.all([
      User.countDocuments(),
      Topic.countDocuments(),
      Reply.countDocuments({ is_deleted: { $ne: true } }),
      AdApplication.countDocuments({ status: 'pending' }),
      AdApplication.countDocuments(),
      User.countDocuments({ is_admin: true }),
      User.countDocuments({ verified: true }),
      User.countDocuments({ is_banned: true }),
    ]);
    res.json({
      users,
      admins,
      verified_users: verifiedUsers,
      banned,
      topics,
      replies,
      ads_pending: adsPending,
      ads_total: adsTotal,
    });
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
      const users = await User.find(q).sort({ created_at: -1 }).limit(limit).lean();
      res.json(users.map(userToResponse));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/users/:id
 * Body may contain: { verified, is_admin, is_banned }
 */
router.patch(
  '/users/:id',
  [
    body('verified').optional().isBoolean(),
    body('is_admin').optional().isBoolean(),
    body('is_banned').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ detail: 'Geçersiz id' });
      const update = {};
      ['verified', 'is_admin', 'is_banned'].forEach((f) => {
        if (typeof req.body[f] === 'boolean') update[f] = req.body[f];
      });
      if (Object.keys(update).length === 0) return res.status(400).json({ detail: 'Boş güncelleme' });
      const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
      if (!user) return res.status(404).json({ detail: 'Kullanıcı bulunamadı' });
      res.json(userToResponse(user));
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
    if (req.params.id === req.userId) return res.status(400).json({ detail: 'Kendi hesabını silemezsin' });
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ detail: 'Kullanıcı bulunamadı' });
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
    const ads = await AdApplication.find(q).sort({ created_at: -1 }).limit(500).lean();
    res.json(ads.map(adToResponse));
  } catch (err) {
    next(err);
  }
});

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
      ).lean();
      if (!ad) return res.status(404).json({ detail: 'Başvuru bulunamadı' });
      res.json(adToResponse(ad));
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/ads/:id', async (req, res, next) => {
  try {
    const r = await AdApplication.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ detail: 'Başvuru bulunamadı' });
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
    const topics = await Topic.find().sort({ created_at: -1 }).limit(limit).lean();
    res.json(topics.map(topicToResponse));
  } catch (err) {
    next(err);
  }
});

router.delete('/topics/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ detail: 'Geçersiz id' });
    const t = await Topic.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ detail: 'Konu bulunamadı' });
    await Reply.deleteMany({ topic_id: t._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/topics/:id',
  [
    body('is_pinned').optional().isBoolean(),
    body('is_locked').optional().isBoolean(),
    body('is_vip').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const update = {};
      ['is_pinned', 'is_locked', 'is_vip'].forEach((f) => {
        if (typeof req.body[f] === 'boolean') update[f] = req.body[f];
      });
      if (Object.keys(update).length === 0) return res.status(400).json({ detail: 'Boş güncelleme' });
      const t = await Topic.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
      if (!t) return res.status(404).json({ detail: 'Konu bulunamadı' });
      res.json(topicToResponse(t));
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/replies/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ detail: 'Geçersiz id' });
    const r = await Reply.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ detail: 'Cevap bulunamadı' });
    await Topic.updateOne({ _id: r.topic_id }, { $inc: { replies_count: -1 } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/categories',
  [
    body('slug').isString().trim().notEmpty(),
    body('title').isString().trim().notEmpty(),
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
    if (!cat) return res.status(404).json({ detail: 'Kategori bulunamadı' });
    res.json(cat.toJSON());
  } catch (err) {
    next(err);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ detail: 'Kategori bulunamadı' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
