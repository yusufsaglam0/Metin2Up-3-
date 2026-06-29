const express = require('express');
const Rank = require('../models/Rank');

const router = express.Router();

/**
 * GET /api/ranks - Returns all ranks ordered by min posts.
 */
router.get('/', async (_req, res, next) => {
  try {
    const ranks = await Rank.find().sort({ minPosts: 1 }).lean();
    res.json(ranks.map((r) => ({ ...r, id: r._id.toString(), _id: undefined })));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
