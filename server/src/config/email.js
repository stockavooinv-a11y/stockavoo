import nodemailer from 'nodemailer';

/**
 * EMAIL CONFIGURATION
 *
 * Nodemailer setup for sending emails.
 *
 * Email Service Options:
 * 1. Gmail - Use for real emails (requires App Password)
 * 2. Mailtrap - Use for testing (catches emails without sending)
 * 3. SendGrid/Mailgun - Production email services
 *
 * How it works:
 * 1. Create a transporter (connection to email service)
 * 2. Define email options (to, from, subject, content)
 * 3. Send email using transporter
 */

/**
 * Create email transporter
 * This connects to the email service
 */
const createTransporter = () => {
  // Check which email service to use based on environment
  if (process.env.EMAIL_SERVICE === 'gmail') {
    // Gmail Configuration
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // This should be App Password, not regular password
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'mailtrap') {
    // Mailtrap Configuration (for testing)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'smtp') {
    // Generic SMTP Configuration (SendGrid, Mailgun, etc.)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    throw new Error('Email service not configured. Please set EMAIL_SERVICE in .env');
  }
};

/**
 * Send email function
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text content
 * @param {String} options.html - HTML content
 */
export const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = createTransporter();

    // Define email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Stockavoo'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Verify email configuration
 * Call this on startup to ensure email is configured correctly
 */
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is configured and ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error.message);
    console.log('📧 Emails will not be sent. Please check your .env configuration.');
    return false;
  }
};

export default sendEmail;
