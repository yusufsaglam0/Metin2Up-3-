const express = require('express');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Reply = require('../models/Reply');

const router = express.Router();

/**
 * GET /api/stats
 * Response: { totalTopics, totalReplies, totalMembers, newestMember } (camelCase!)
 */
router.get('/', async (_req, res, next) => {
  try {
    const [totalTopics, totalRepliesAgg, totalReplies, totalMembers, newest] = await Promise.all([
      Topic.countDocuments(),
      Topic.aggregate([{ $group: { _id: null, sum: { $sum: '$replies_count' } } }]),
      Reply.countDocuments({ is_deleted: { $ne: true } }),
      User.countDocuments({ is_banned: { $ne: true } }),
      User.findOne().sort({ created_at: -1 }).select('username').lean(),
    ]);
    res.json({
      totalTopics: totalTopics || 0,
      totalReplies: Math.max(totalRepliesAgg[0]?.sum || 0, totalReplies || 0),
      totalMembers: totalMembers || 0,
      newestMember: newest?.username || '-',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
