const express = require('express');
const Rank = require('../models/Rank');

const router = express.Router();

/**
 * GET /api/ranks
 * Response: [{ name, color, icon, description, minPosts }]  (minPosts camelCase!)
 */
router.get('/', async (_req, res, next) => {
  try {
    const ranks = await Rank.find().sort({ minPosts: 1 }).lean();
    res.json(
      ranks.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        color: r.color,
        icon: r.icon,
        description: r.description || '',
        minPosts: r.minPosts,
      }))
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
