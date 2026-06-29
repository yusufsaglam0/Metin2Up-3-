const { validationResult } = require('express-validator');

/**
 * Run after express-validator chain to short-circuit on validation errors.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({
    error: 'Doğrulama hatası',
    details: errors.array().map((e) => ({ field: e.path || e.param, message: e.msg })),
  });
}

module.exports = { validate };
