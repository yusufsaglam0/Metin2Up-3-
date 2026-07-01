const express = require('express');
const { body } = require('express-validator');
const AdApplication = require('../models/AdApplication');
const { validate } = require('../middleware/validate');
const { writeLimiter } = require('../middleware/rateLimit');

const router = express.Router();

/**
 * POST /api/ads/apply
 * Body: { name, contact, message, ad_type }
 */
router.post(
  '/apply',
  writeLimiter,
  [
    body('name').isString().trim().isLength({ min: 1, max: 100 }),
    body('contact').isString().trim().isLength({ min: 3, max: 200 }),
    body('message').isString().trim().isLength({ min: 5, max: 2000 }),
    body('ad_type').optional().isIn(['banner', 'vip', 'side', 'sponsor', 'other']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, contact, message, ad_type } = req.body;
      const doc = await AdApplication.create({
        name,
        contact,
        message,
        ad_type: ad_type || 'banner',
        ip: req.ip || '',
      });
      res.status(201).json({ ok: true, id: doc._id.toString() });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
