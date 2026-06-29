const express = require('express');
const Category = require('../models/Category');
const Topic = require('../models/Topic');

const router = express.Router();

/**
 * GET /api/categories
 * Returns all categories with subforums + topic counts + last post info.
 */
router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
    const result = [];

    for (const cat of categories) {
      const enrichedSubs = [];
      for (const sf of cat.subForums || []) {
        const [topicsCount, repliesAgg, lastTopic] = await Promise.all([
          Topic.countDocuments({ subForumSlug: sf.slug }),
          Topic.aggregate([
            { $match: { subForumSlug: sf.slug } },
            { $group: { _id: null, total: { $sum: '$repliesCount' } } },
          ]),
          Topic.findOne({ subForumSlug: sf.slug })
            .sort({ isPinned: -1, updatedAt: -1 })
            .select('title author verified isNew updatedAt')
            .lean(),
        ]);
        enrichedSubs.push({
          slug: sf.slug,
          name: sf.name,
          description: sf.description,
          topics: topicsCount,
          replies: repliesAgg[0]?.total || 0,
          lastPost: lastTopic
            ? {
                id: lastTopic._id.toString(),
                title: lastTopic.title,
                user: lastTopic.author,
                verified: !!lastTopic.verified,
                isNew: !!lastTopic.isNew,
                at: lastTopic.updatedAt,
              }
            : null,
        });
      }
      result.push({
        id: cat._id.toString(),
        slug: cat.slug,
        title: cat.title,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        subForums: enrichedSubs,
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/categories/subforums/:slug
 * Returns a single subforum with paginated topics.
 */
router.get('/subforums/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug || '').toLowerCase();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(5, parseInt(req.query.pageSize, 10) || 20));

    const category = await Category.findOne({ 'subForums.slug': slug }).lean();
    if (!category) return res.status(404).json({ error: 'Alt forum bulunamadı' });
    const sub = category.subForums.find((s) => s.slug === slug);

    const [total, topics] = await Promise.all([
      Topic.countDocuments({ subForumSlug: slug }),
      Topic.find({ subForumSlug: slug })
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
    ]);

    res.json({
      category: { id: category._id.toString(), title: category.title, slug: category.slug },
      subforum: { slug: sub.slug, name: sub.name, description: sub.description },
      topics: topics.map((t) => ({ ...t, id: t._id.toString(), _id: undefined })),
      total,
      page,
      pageSize,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
