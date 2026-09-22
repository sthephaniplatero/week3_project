const { Router } = require('express');
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/auth');
const { githubCallback, logout, profile, status } = require('../controllers/auth.controller');

const router = Router();

// Kicks off the GitHub OAuth flow. Visiting this in a browser redirects to
// GitHub's consent screen; approving it creates the local account on first
// login (see the GitHub strategy in src/config/passport.js).
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub redirects back here after the user approves/denies access.
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure', session: true }),
  githubCallback
);

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'GitHub login failed or was cancelled' });
});

router.get('/logout', logout);

// Publicly readable: tells the caller whether they're currently logged in.
router.get('/status', status);

// Only visible while logged in — demonstrates a route restricted by OAuth.
router.get('/profile', ensureAuthenticated, profile);

module.exports = router;
