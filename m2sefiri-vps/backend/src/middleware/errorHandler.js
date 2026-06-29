/**
 * Global error handler. Logs + sends generic message in production.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  // Mongoose validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Doğrulama hatası',
      details: Object.values(err.errors || {}).map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Geçersiz kimlik / format' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Kayıt zaten mevcut', fields: Object.keys(err.keyPattern || {}) });
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error('[ERROR]', req.method, req.originalUrl, '-', err.message);
    if (status >= 500) console.error(err.stack);
  }

  res.status(status).json({
    error: err.expose || status < 500 ? err.message : 'Sunucu hatası',
  });
}

module.exports = errorHandler;
