module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: { code: err.code || 'ERROR', message: err.message || 'Internal Server Error' }
  });
};
