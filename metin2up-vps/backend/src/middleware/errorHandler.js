// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;

  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors || {})[0];
    return res.status(400).json({
      detail: first ? `${first.path}: ${first.message}` : 'Doğrulama hatası',
      errors: Object.values(err.errors || {}).map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ detail: 'Geçersiz kimlik / format' });
  }
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return res.status(409).json({
      detail: `Kayıt zaten mevcut${fields.length ? ': ' + fields.join(', ') : ''}`,
      fields,
    });
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error('[ERROR]', req.method, req.originalUrl, '-', err.message);
    if (status >= 500) console.error(err.stack);
  }

  const message = err.expose || status < 500 ? err.message : 'Sunucu hatası';
  res.status(status).json({ detail: message });
}

module.exports = errorHandler;
