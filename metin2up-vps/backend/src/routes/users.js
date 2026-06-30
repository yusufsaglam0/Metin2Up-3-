const express = require('express');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Reply = require('../models/Reply');
const Rank = require('../models/Rank');

const router = express.Router();

/**
 * GET /api/users/:username
 * Response: { user: {...}, topics: [...], replies: [...] }
 */
router.get('/:username', async (req, res, next) => {
  try {
    const username = String(req.params.username || '').trim();
    const user = await User.findOne({ username }).lean();
    if (!user) return res.status(404).json({ detail: 'Kullanıcı bulunamadı' });

    const [topics, replies, rank] = await Promise.all([
      Topic.find({ author: username }).sort({ created_at: -1 }).limit(10).lean(),
      Reply.find({ author: username, is_deleted: { $ne: true } }).sort({ created_at: -1 }).limit(10).lean(),
      Rank.findOne({ minPosts: { $lte: user.post_count || 0 } }).sort({ minPosts: -1 }).lean(),
    ]);

    res.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
        verified: !!user.verified,
        is_admin: !!user.is_admin,
        is_seed: !!user.is_seed,
        post_count: user.post_count || 0,
        created_at: user.created_at,
        rank: rank
          ? { name: rank.name, color: rank.color, icon: rank.icon, description: rank.description || '', minPosts: rank.minPosts }
          : null,
      },
      topics: topics.map((t) => ({
        id: t._id.toString(),
        title: t.title,
        subforum_slug: t.subforum_slug,
        replies_count: t.replies_count || 0,
        views: t.views || 0,
        created_at: t.created_at,
      })),
      replies: replies.map((r) => ({
        id: r._id.toString(),
        topic_id: r.topic_id ? r.topic_id.toString() : null,
        content: r.content,
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
