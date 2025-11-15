import { sendEmail } from "../config/email.js";
import {
  verificationEmailTemplate,
  welcomeEmailTemplate,
  passwordResetEmailTemplate,
} from "./emailTemplates.js";

/**
 * EMAIL HELPER FUNCTIONS
 *
 * High-level functions for sending specific types of emails.
 * These wrap the generic sendEmail function with specific templates.
 */

/**
 * Send verification email to user
 * @param {Object} user - User object
 * @param {String} verificationToken - Unhashed verification token
 */
export const sendVerificationEmail = async (user, verificationToken) => {
  try {
    // Construct verification URL
    // This URL should point to your frontend verification page
    // The frontend will then call the backend API to verify
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Alternative: Direct backend URL (less user-friendly)
    // const verificationUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/auth/verify-email/${verificationToken}`;

    // Get email template
    const { html, text } = verificationEmailTemplate(
      user.fullName,
      verificationUrl
    );

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - Stockavoo",
      text,
      html,
    });

    console.log(`✅ Verification email sent to: ${user.email}`);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    // Don't throw error - we don't want to fail registration if email fails
    // User can request resend later
    return false;
  }
};

/**
 * Send welcome email after successful verification
 * @param {Object} user - User object
 */
export const sendWelcomeEmail = async (user) => {
  try {
    const { html, text } = welcomeEmailTemplate(user.fullName);

    await sendEmail({
      to: user.email,
      subject: "Welcome to Stockavoo! 🎉",
      text,
      html,
    });

    console.log(`✅ Welcome email sent to: ${user.email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {String} resetToken - Unhashed reset token
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    // Construct password reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const { html, text } = passwordResetEmailTemplate(user.fullName, resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - Stockavoo",
      text,
      html,
    });

    console.log(`✅ Password reset email sent to: ${user.email}`);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

/**
 * Send test email (for testing configuration)
 * @param {String} to - Recipient email
 */
export const sendTestEmail = async (to) => {
  try {
    await sendEmail({
      to,
      subject: "Test Email - Stockavoo",
      text: "This is a test email from Stockavoo. If you received this, your email configuration is working correctly!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #667eea;">✅ Test Email Successful!</h2>
            <p>This is a test email from Stockavoo.</p>
            <p>If you received this, your email configuration is working correctly!</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Test email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending test email:", error);
    throw error;
  }
};
