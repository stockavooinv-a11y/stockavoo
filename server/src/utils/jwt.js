import jwt from 'jsonwebtoken';

/**
 * JWT UTILITIES
 *
 * JWT (JSON Web Token) is used for authentication.
 * Think of it like a movie ticket - once you buy it (login), you can use it
 * to access the theater (protected routes) without buying again each time.
 *
 * How it works:
 * 1. User logs in with email/password
 * 2. Server verifies credentials
 * 3. Server creates a JWT token containing user info
 * 4. Token is sent to client (usually stored in localStorage or cookies)
 * 5. Client includes token in every request
 * 6. Server verifies token before allowing access to protected routes
 */

/**
 * Generate JWT token for a user
 * @param {String} userId - The user's MongoDB _id
 * @returns {String} - Signed JWT token
 */
export const generateToken = (userId) => {
  // Create token with user ID as payload
  const token = jwt.sign(
    { id: userId }, // Payload - data embedded in token
    process.env.JWT_SECRET, // Secret key to sign token
    {
      expiresIn: process.env.JWT_EXPIRE || '7d' // Token expires in 7 days
    }
  );

  return token;
};

/**
 * Verify JWT token
 * @param {String} token - The JWT token to verify
 * @returns {Object} - Decoded token payload if valid
 */
export const verifyToken = (token) => {
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    // Token is invalid or expired
    throw new Error('Invalid or expired token');
  }
};
