const getRoot = (req, res) => {
  const loggedIn = Boolean(req.isAuthenticated && req.isAuthenticated());
  res.json({
    message: 'Tasks API is running',
    health: '/health',
    docs: '/api-docs',
    tasks: '/tasks',
    categories: '/categories',
    auth: {
      loggedIn,
      user: loggedIn ? req.user.username : null,
      login: loggedIn ? undefined : '/auth/github',
      logout: loggedIn ? '/auth/logout' : undefined,
      profile: '/auth/profile',
    },
  });
};

const getHealth = (req, res) => {
  res.json({ status: 'ok' });
};

module.exports = { getRoot, getHealth };
