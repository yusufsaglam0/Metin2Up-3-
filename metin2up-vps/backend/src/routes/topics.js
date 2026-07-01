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

function topicToResponse(t) {
  return {
    id: t._id ? t._id.toString() : t.id,
    subforum_slug: t.subforum_slug,
    title: t.title,
    content: t.content,
    author: t.author,
    verified: !!t.verified,
    is_new: !!t.is_new,
    is_vip: !!t.is_vip,
    is_pinned: !!t.is_pinned,
    is_locked: !!t.is_locked,
    replies_count: t.replies_count || 0,
    views: t.views || 0,
    created_at: t.created_at,
    updated_at: t.updated_at,
  };
}

function replyToResponse(r) {
  return {
    id: r._id ? r._id.toString() : r.id,
    topic_id: r.topic_id ? r.topic_id.toString() : null,
    author: r.author,
    verified: !!r.verified,
    content: r.content,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

/**
 * GET /api/topics/vip
 */
router.get('/vip', async (_req, res, next) => {
  try {
    const topics = await Topic.find({ is_vip: true }).sort({ created_at: -1 }).limit(20).lean();
    res.json(topics.map(topicToResponse));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/topics?filter=upcoming&limit=30&subforum=slug
 */
router.get(
  '/',
  [query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  async (req, res, next) => {
    try {
      const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
      const q = {};
      if (req.query.filter === 'upcoming') q.is_new = true;
      if (req.query.subforum) q.subforum_slug = String(req.query.subforum).toLowerCase();
      const topics = await Topic.find(q).sort({ created_at: -1 }).limit(limit).lean();
      res.json(topics.map(topicToResponse));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /api/topics
 * Body: { subforum_slug, title, content }
 */
router.post(
  '/',
  requireAuth,
  writeLimiter,
  [
    body('subforum_slug').isString().trim().notEmpty(),
    body('title').isString().trim().isLength({ min: 3, max: 200 }),
    body('content').isString().trim().isLength({ min: 1, max: 10000 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { subforum_slug, title, content } = req.body;
      const slug = subforum_slug.toLowerCase();
      const exists = await Category.exists({ 'subForums.slug': slug });
      if (!exists) return res.status(400).json({ detail: 'Geçersiz alt forum' });

      const topic = await Topic.create({
        subforum_slug: slug,
        title,
        content,
        author: req.user.username,
        author_id: req.user._id,
        verified: !!req.user.verified,
        is_new: true,
        last_reply_at: new Date(),
      });
      await User.updateOne({ _id: req.user._id }, { $inc: { post_count: 1 } });
      res.status(201).json(topicToResponse(topic.toObject()));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/topics/:id
 * Response: { topic: {...}, replies: [...] }
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ detail: 'Geçersiz konu id' });
    }
    const topic = await Topic.findById(req.params.id).lean();
    if (!topic) return res.status(404).json({ detail: 'Konu bulunamadı' });

    // Fire-and-forget view increment
    Topic.updateOne({ _id: req.params.id }, { $inc: { views: 1 } }).catch(() => {});
    topic.views = (topic.views || 0) + 1;

    const replies = await Reply.find({ topic_id: topic._id, is_deleted: { $ne: true } })
      .sort({ created_at: 1 })
      .lean();

    res.json({
      topic: topicToResponse(topic),
      replies: replies.map(replyToResponse),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/topics/:id/replies
 * Body: { content }
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
        return res.status(400).json({ detail: 'Geçersiz konu id' });
      }
      const topic = await Topic.findById(req.params.id);
      if (!topic) return res.status(404).json({ detail: 'Konu bulunamadı' });
      if (topic.is_vip) return res.status(403).json({ detail: 'VİP konulara yorum yapılamaz' });
      if (topic.is_locked) return res.status(403).json({ detail: 'Bu konu kilitlenmiş' });

      const reply = await Reply.create({
        topic_id: topic._id,
        content: req.body.content,
        author: req.user.username,
        author_id: req.user._id,
        verified: !!req.user.verified,
      });

      const now = new Date();
      await Topic.updateOne(
        { _id: topic._id },
        { $inc: { replies_count: 1 }, $set: { last_reply_at: now, updated_at: now } }
      );
      await User.updateOne({ _id: req.user._id }, { $inc: { post_count: 1 } });

      res.status(201).json(replyToResponse(reply.toObject()));
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
