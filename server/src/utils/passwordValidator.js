/**
 * PASSWORD VALIDATION UTILITIES
 *
 * Validates password strength according to requirements:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 symbol
 */

/**
 * Validate password strength
 * @param {String} password - The password to validate
 * @returns {Object} - { isValid: Boolean, errors: Array }
 */
export const validatePassword = (password) => {
  const errors = [];

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 uppercase letter');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least 1 lowercase letter');
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }

  // Check for symbol
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least 1 symbol');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get password strength message for UI
 * @param {String} password - The password to check
 * @returns {String} - Strength message
 */
export const getPasswordStrength = (password) => {
  const { isValid, errors } = validatePassword(password);

  if (isValid) {
    return 'Strong password';
  }

  return errors.join(', ');
};
