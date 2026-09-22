const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
        const avatarUrl = profile.photos && profile.photos.length ? profile.photos[0].value : null;

        // Upsert: first login creates the account, later logins just update
        // the cached profile fields.
        const user = await User.findOneAndUpdate(
          { githubId: profile.id },
          {
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username,
            email,
            avatarUrl,
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
