// Sets up "Login with Google" using Passport.
// When someone logs in, we look them up by their Google ID in MySQL.
// If they don't exist yet, we create them. If their email is in
// ADMIN_EMAILS (in .env), we mark them as an admin.
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const adminEmails = (process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
        const role = email && adminEmails.includes(email) ? 'admin' : 'user';

        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            role,
          });
        } else if (user.role !== role) {
          // Keeps role in sync if you add/remove someone from ADMIN_EMAILS later
          user.role = role;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
