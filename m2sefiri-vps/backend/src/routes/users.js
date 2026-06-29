const express = require('express');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Reply = require('../models/Reply');
const Rank = require('../models/Rank');

const router = express.Router();

/**
 * GET /api/users/:username - Public profile.
 */
router.get('/:username', async (req, res, next) => {
  try {
    const username = String(req.params.username || '').trim();
    const user = await User.findOne({ username }).select('-passwordHash -email').lean();
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    const [topics, replies, rank] = await Promise.all([
      Topic.find({ author: username }).sort({ createdAt: -1 }).limit(10).lean(),
      Reply.find({ author: username, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(10).lean(),
      Rank.findOne({ minPosts: { $lte: user.postCount || 0 } }).sort({ minPosts: -1 }).lean(),
    ]);

    res.json({
      user: { ...user, id: user._id.toString(), _id: undefined, rank: rank || null },
      topics: topics.map((t) => ({ ...t, id: t._id.toString(), _id: undefined })),
      replies: replies.map((r) => ({ ...r, id: r._id.toString(), _id: undefined })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
