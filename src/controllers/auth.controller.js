const githubCallback = (req, res) => {
  // req.user was set by the GitHub strategy in src/config/passport.js
  res.redirect('/auth/profile');
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
};

const profile = (req, res) => {
  // Protected by ensureAuthenticated, so req.user is always set here.
  const { _id, githubId, username, displayName, email, avatarUrl, createdAt } = req.user;
  res.json({ _id, githubId, username, displayName, email, avatarUrl, createdAt });
};

const status = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ loggedIn: true, username: req.user.username });
  }
  res.json({ loggedIn: false });
};

module.exports = { githubCallback, logout, profile, status };
