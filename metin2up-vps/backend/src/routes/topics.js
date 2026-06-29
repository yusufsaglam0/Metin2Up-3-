const express = require('express');
const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Reply = require('../models/Reply');
const Category = require('../models/Category');
const User = require('../models/User');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { writeLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * GET /api/topics/vip - List VIP topics.
 */
router.get('/vip', async (_req, res, next) => {
  try {
    const topics = await Topic.find({ isVip: true }).sort({ createdAt: -1 }).limit(20).lean();
    res.json(topics.map((t) => ({ ...t, id: t._id.toString(), _id: undefined })));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/topics?filter=upcoming&limit=20
 */
router.get(
  '/',
  [query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  async (req, res, next) => {
    try {
      const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
      const q = {};
      if (req.query.filter === 'upcoming') q.isNew = true;
      if (req.query.subforum) q.subForumSlug = String(req.query.subforum).toLowerCase();
      const topics = await Topic.find(q).sort({ createdAt: -1 }).limit(limit).lean();
      res.json(topics.map((t) => ({ ...t, id: t._id.toString(), _id: undefined })));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/topics - Create topic (auth required).
 */
router.post(
  '/',
  requireAuth,
  writeLimiter,
  [
    body('subForumSlug').isString().trim().notEmpty(),
    body('title').isString().trim().isLength({ min: 3, max: 200 }),
    body('content').isString().trim().isLength({ min: 1, max: 10000 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { subForumSlug, title, content } = req.body;
      const slug = subForumSlug.toLowerCase();
      // Validate subforum exists
      const exists = await Category.exists({ 'subForums.slug': slug });
      if (!exists) return res.status(400).json({ error: 'Geçersiz alt forum' });

      const topic = await Topic.create({
        subForumSlug: slug,
        title,
        content,
        author: req.user.username,
        authorId: req.user._id,
        verified: !!req.user.verified,
        isNew: true,
        lastReplyAt: new Date(),
      });
      await User.updateOne({ _id: req.user._id }, { $inc: { postCount: 1 } });
      res.status(201).json(topic.toJSON());
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/topics/:id - Get topic with replies.
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Geçersiz konu id' });
    }
    const topic = await Topic.findById(req.params.id).lean();
    if (!topic) return res.status(404).json({ error: 'Konu bulunamadı' });
    // Increment views (fire-and-forget)
    Topic.updateOne({ _id: req.params.id }, { $inc: { views: 1 } }).catch(() => {});
    topic.views = (topic.views || 0) + 1;

    const replies = await Reply.find({ topicId: topic._id, isDeleted: { $ne: true } })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      topic: { ...topic, id: topic._id.toString(), _id: undefined },
      replies: replies.map((r) => ({ ...r, id: r._id.toString(), _id: undefined })),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/topics/:id/replies - Add reply (auth).
 */
router.post(
  '/:id/replies',
  requireAuth,
  writeLimiter,
  [body('content').isString().trim().isLength({ min: 1, max: 5000 })],
  validate,
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Geçersiz konu id' });
      }
      const topic = await Topic.findById(req.params.id);
      if (!topic) return res.status(404).json({ error: 'Konu bulunamadı' });
      if (topic.isVip) return res.status(403).json({ error: 'VİP konulara yorum yapılamaz' });
      if (topic.isLocked) return res.status(403).json({ error: 'Bu konu kilitlenmiş' });

      const reply = await Reply.create({
        topicId: topic._id,
        content: req.body.content,
        author: req.user.username,
        authorId: req.user._id,
        verified: !!req.user.verified,
      });

      const now = new Date();
      await Topic.updateOne(
        { _id: topic._id },
        { $inc: { repliesCount: 1 }, $set: { lastReplyAt: now, updatedAt: now } }
      );
      await User.updateOne({ _id: req.user._id }, { $inc: { postCount: 1 } });

      res.status(201).json(reply.toJSON());
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
