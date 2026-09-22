const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'You must be logged in to do that. Go to /auth/github to log in.' });
};

module.exports = { ensureAuthenticated };
