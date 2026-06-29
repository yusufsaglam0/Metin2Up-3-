const express = require('express');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Reply = require('../models/Reply');

const router = express.Router();

/**
 * GET /api/stats - Public forum statistics.
 */
router.get('/', async (_req, res, next) => {
  try {
    const [totalTopics, totalRepliesAgg, totalReplies, totalMembers, newest] = await Promise.all([
      Topic.countDocuments(),
      Topic.aggregate([{ $group: { _id: null, sum: { $sum: '$repliesCount' } } }]),
      Reply.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ isBanned: { $ne: true } }),
      User.findOne().sort({ createdAt: -1 }).select('username').lean(),
    ]);
    res.json({
      totalTopics,
      totalReplies: Math.max(totalRepliesAgg[0]?.sum || 0, totalReplies),
      totalMembers,
      newestMember: newest?.username || '-',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
