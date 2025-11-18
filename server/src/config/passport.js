import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

/**
 * PASSPORT OAUTH CONFIGURATION
 *
 * This file configures Passport.js to handle OAuth authentication
 * Supports: Google, Facebook
 */

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists - check if they signed up with Google
          if (user.authProvider === 'google') {
            // Update last login
            user.lastLogin = Date.now();
            await user.save();
            return done(null, user);
          } else {
            // User exists but signed up with email/password
            return done(null, false, {
              message: 'An account with this email already exists. Please login with your email and password.'
            });
          }
        }

        // Create new user from Google profile
        user = await User.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          authProvider: 'google',
          authProviderId: profile.id,
          profilePicture: profile.photos[0]?.value,
          isVerified: true, // Google already verified their email
          agreedToTerms: true, // Auto-accept terms for OAuth users
          lastLogin: Date.now()
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get email from profile or generate one from Facebook ID
        const email = profile.emails && profile.emails[0]
          ? profile.emails[0].value
          : `${profile.id}@facebook.user`;

        // First, try to find user by Facebook ID (more reliable)
        let user = await User.findOne({ authProviderId: profile.id, authProvider: 'facebook' });

        if (user) {
          // Update last login
          user.lastLogin = Date.now();
          await user.save();
          return done(null, user);
        }

        // If email is real (not generated), check if it exists with different provider
        if (profile.emails && profile.emails[0]) {
          const existingUser = await User.findOne({ email: email });
          if (existingUser) {
            return done(null, false, {
              message: 'An account with this email already exists. Please login with your registered method.'
            });
          }
        }

        // Create new user from Facebook profile
        user = await User.create({
          fullName: profile.displayName,
          email: email,
          authProvider: 'facebook',
          authProviderId: profile.id,
          profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
          isVerified: true, // Facebook already verified their identity
          agreedToTerms: true, // Auto-accept terms for OAuth users
          lastLogin: Date.now()
        });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
