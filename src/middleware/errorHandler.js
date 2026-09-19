const notFound = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) =>
      e.name === 'CastError' ? `Invalid value for '${e.path}': ${e.value}` : e.message
    );
    return res.status(400).json({ error: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    const message =
      err.path === '_id'
        ? `Invalid id: ${err.value}`
        : `Invalid value for '${err.path}': ${err.value}`;
    return res.status(400).json({ error: message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = { notFound, errorHandler };
