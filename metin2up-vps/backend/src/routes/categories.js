const express = require('express');
const Category = require('../models/Category');
const Topic = require('../models/Topic');

const router = express.Router();

/**
 * GET /api/categories
 * Returns array shaped for frontend ForumCategory component:
 *   [{ id, slug, title, description, icon, subForums: [{ slug, name, description, topics, lastPost: { id, title, user, verified, isNew } | null }] }]
 */
router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, created_at: 1 }).lean();
    const result = [];

    for (const cat of categories) {
      const subForumSlugs = (cat.subForums || []).map((s) => s.slug);

      // Aggregate topic counts per subforum in one query
      const counts = await Topic.aggregate([
        { $match: { subforum_slug: { $in: subForumSlugs } } },
        { $group: { _id: '$subforum_slug', topics: { $sum: 1 } } },
      ]);
      const countMap = Object.fromEntries(counts.map((c) => [c._id, c.topics]));

      // Last post per subforum
      const enrichedSubs = [];
      for (const sf of cat.subForums || []) {
        const last = await Topic.findOne({ subforum_slug: sf.slug })
          .sort({ is_pinned: -1, updated_at: -1 })
          .select('title author verified is_new updated_at')
          .lean();
        enrichedSubs.push({
          slug: sf.slug,
          name: sf.name,
          description: sf.description || '',
          topics: countMap[sf.slug] || 0,
          lastPost: last
            ? {
                id: last._id.toString(),
                title: last.title,
                user: last.author,
                verified: !!last.verified,
                isNew: !!last.is_new,
              }
            : null,
        });
      }

      result.push({
        id: cat.slug, // Frontend uses cat.id as React key + for categoryIconMap (slug-based)
        slug: cat.slug,
        title: cat.title,
        description: cat.description || '',
        icon: cat.icon,
        subForums: enrichedSubs,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
