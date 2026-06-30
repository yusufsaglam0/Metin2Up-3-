const express = require('express');
const Category = require('../models/Category');
const Topic = require('../models/Topic');

const router = express.Router();

/**
 * GET /api/subforums/:slug
 * Returns object shape: { category: { title }, subforum: { name, description }, total, topics: [...] }
 * Each topic has snake_case fields: is_new, is_vip, created_at, replies_count, views, etc.
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug || '').toLowerCase();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(5, parseInt(req.query.pageSize, 10) || 30));

    const category = await Category.findOne({ 'subForums.slug': slug }).lean();
    if (!category) return res.status(404).json({ detail: 'Alt forum bulunamadı' });
    const sub = category.subForums.find((s) => s.slug === slug);

    const [total, topics] = await Promise.all([
      Topic.countDocuments({ subforum_slug: slug }),
      Topic.find({ subforum_slug: slug })
        .sort({ is_pinned: -1, updated_at: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
    ]);

    res.json({
      category: {
        id: category._id.toString(),
        slug: category.slug,
        title: category.title,
      },
      subforum: {
        slug: sub.slug,
        name: sub.name,
        description: sub.description || '',
      },
      total,
      page,
      pageSize,
      topics: topics.map((t) => ({
        id: t._id.toString(),
        subforum_slug: t.subforum_slug,
        title: t.title,
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
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
