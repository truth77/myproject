const passport = require('passport');
const { queryFbUser, insertFbUser } = require('../models/auth');

// Check if Facebook authentication is configured
const isFacebookConfigured = process.env.CLIENT_ID && process.env.CLIENT_SECRET;

// Only try to require FacebookStrategy if the module is installed
let FacebookStrategy;
try {
  FacebookStrategy = require('passport-facebook-token').Strategy;
} catch (error) {
  console.warn('passport-facebook-token module not found. Facebook login will be disabled.');
  module.exports = { isFacebookConfigured: false };
  return;
}

// Initialize Facebook strategy if configured
if (isFacebookConfigured) {
  try {
    passport.use(new FacebookStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        profileFields: ['id', 'displayName', 'photos']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user;

          if (profile) {
            user = await queryFbUser(profile.id);
          }

          if (!user && profile) {
            user = await insertFbUser(
              profile.displayName || 'Facebook User',
              profile.id,
              profile.photos && profile.photos[0] ? profile.photos[0].value : null
            );
          }
          
          return done(null, user || false);
        } catch (error) {
          console.error('Facebook authentication error:', error);
          return done(error, false);
        }
      }
    ));
    console.log('Facebook authentication initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Facebook authentication:', error);
    isFacebookConfigured = false;
  }
} else {
  console.warn('Facebook authentication is not configured. Set CLIENT_ID and CLIENT_SECRET environment variables to enable.');
}

module.exports = { isFacebookConfigured };
