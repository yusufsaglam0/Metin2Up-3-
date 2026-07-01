const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const first = errors.array()[0];
  const detailMsg = `${first.path || first.param || 'alan'}: ${first.msg}`;
  return res.status(400).json({
    detail: detailMsg,
    errors: errors.array().map((e) => ({ field: e.path || e.param, message: e.msg })),
  });
}

module.exports = { validate };
