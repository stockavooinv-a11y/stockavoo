/**
 * EMAIL TEMPLATES
 *
 * HTML email templates for various email types.
 * Each template returns both HTML (for email clients that support it)
 * and plain text (fallback for simple email clients)
 */

/**
 * Verification Email Template
 * @param {String} userName - User's full name
 * @param {String} verificationUrl - The verification link
 * @returns {Object} - { html, text }
 */
export const verificationEmailTemplate = (userName, verificationUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Stockavoo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="padding: 20px 25px 15px 25px; text-align: center; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); border-radius: 6px 6px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">Stockavoo</h1>
                  <p style="margin: 5px 0 0 0; color: #D4AF37; font-size: 13px; font-weight: 500;">Inventory Management</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 25px;">
                  <h2 style="margin: 0 0 12px 0; color: #333333; font-size: 20px;">Welcome, ${userName}! 🎉</h2>

                  <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                    Thank you for registering with Stockavoo! To get started, verify your email address:
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 15px 0;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 6px 0; color: #666666; font-size: 12px; line-height: 1.4;">
                    Or copy this link:
                  </p>

                  <p style="margin: 0 0 15px 0; color: #7C3E8C; font-size: 12px; word-break: break-all;">
                    ${verificationUrl}
                  </p>

                  <div style="padding: 12px; background-color: #f8f9fa; border-left: 3px solid #D4AF37; border-radius: 3px;">
                    <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.4;">
                      ⏰ <strong>Important:</strong> Link expires in 24 hours.
                    </p>
                  </div>

                  <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px; line-height: 1.4;">
                    Didn't create an account? Ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 15px 25px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 6px 6px;">
                  <p style="margin: 0; color: #999999; font-size: 11px;">
                    © ${new Date().getFullYear()} Stockavoo. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Welcome to Stockavoo, ${userName}!

Thank you for registering with Stockavoo! We're excited to have you on board.

To get started, please verify your email address by clicking the link below:

${verificationUrl}

⏰ IMPORTANT: This verification link will expire in 24 hours for security reasons.

If you didn't create an account with Stockavoo, please ignore this email.

---
© ${new Date().getFullYear()} Stockavoo. All rights reserved.
This is an automated email, please do not reply.
  `;

  return { html, text };
};

/**
 * Welcome Email Template (sent after verification)
 * @param {String} userName - User's full name
 * @returns {Object} - { html, text }
 */
export const welcomeEmailTemplate = (userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Stockavoo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="padding: 20px 25px 15px 25px; text-align: center; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); border-radius: 6px 6px 0 0;">
                  <h1 style="margin: 0; color: #D4AF37; font-size: 22px; font-weight: bold;">✅ Email Verified!</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 25px;">
                  <h2 style="margin: 0 0 12px 0; color: #333333; font-size: 20px;">Welcome, ${userName}! 🎉</h2>

                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                    Your email is verified! You now have full access to all features.
                  </p>

                  <h3 style="margin: 0 0 10px 0; color: #333333; font-size: 16px;">What's Next?</h3>

                  <ul style="margin: 0 0 15px 0; padding-left: 20px; color: #666666; font-size: 13px; line-height: 1.6;">
                    <li>Set up your first business</li>
                    <li>Add your inventory items</li>
                    <li>Invite team members</li>
                    <li>Start tracking your stock</li>
                  </ul>

                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 15px 0;">
                        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold;">
                          Go to Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px; line-height: 1.4;">
                    Need help? Reach out to our support team.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 15px 25px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 6px 6px;">
                  <p style="margin: 0; color: #999999; font-size: 11px;">
                    © ${new Date().getFullYear()} Stockavoo. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
✅ Email Verified!

Welcome to Stockavoo, ${userName}!

Your email has been successfully verified! You now have full access to all Stockavoo features.

What's Next?
- Set up your first business
- Add your inventory items
- Invite team members
- Start tracking your stock

Visit your dashboard: ${process.env.CLIENT_URL}/dashboard

If you have any questions or need help getting started, feel free to reach out to our support team.

---
© ${new Date().getFullYear()} Stockavoo. All rights reserved.
  `;

  return { html, text };
};

/**
 * Password Reset Email Template
 * @param {String} userName - User's full name
 * @param {String} resetUrl - The password reset link
 * @returns {Object} - { html, text }
 */
export const passwordResetEmailTemplate = (userName, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Stockavoo</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="padding: 20px 25px 15px 25px; text-align: center; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); border-radius: 6px 6px 0 0;">
                  <h1 style="margin: 0; color: #D4AF37; font-size: 22px; font-weight: bold;">🔒 Password Reset</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 25px;">
                  <h2 style="margin: 0 0 12px 0; color: #333333; font-size: 20px;">Hi ${userName},</h2>

                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                    We received a request to reset your password. Click the button below to proceed:
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 15px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="padding: 12px; background-color: #fff3cd; border-left: 3px solid #D4AF37; border-radius: 3px;">
                    <p style="margin: 0; color: #856404; font-size: 12px; line-height: 1.4;">
                      ⏰ <strong>Important:</strong> Link expires in 1 hour.
                    </p>
                  </div>

                  <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px; line-height: 1.4;">
                    Didn't request this? Ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 15px 25px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 6px 6px;">
                  <p style="margin: 0; color: #999999; font-size: 11px;">
                    © ${new Date().getFullYear()} Stockavoo. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
🔒 Password Reset Request

Hi ${userName},

We received a request to reset your password for your Stockavoo account.

Click the link below to reset your password:
${resetUrl}

⏰ IMPORTANT: This password reset link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

---
© ${new Date().getFullYear()} Stockavoo. All rights reserved.
  `;

  return { html, text };
};

/**
 * User Invitation Email Template
 * @param {String} userName - User's full name
 * @param {String} userEmail - User's email
 * @param {String} tempPassword - Temporary password
 * @param {String} verificationToken - Email verification token
 * @returns {String} - HTML email content
 */
export const userInviteTemplate = (userName, userEmail, tempPassword, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You've been invited to SmartInventory</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

              <!-- Header -->
              <tr>
                <td style="padding: 20px 25px 15px 25px; text-align: center; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); border-radius: 6px 6px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">SmartInventory</h1>
                  <p style="margin: 5px 0 0 0; color: #D4AF37; font-size: 13px; font-weight: 500;">You've been invited!</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 25px;">
                  <h2 style="margin: 0 0 12px 0; color: #333333; font-size: 20px;">Welcome to the team, ${userName}! 👋</h2>

                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                    You've been invited to join SmartInventory. Below are your login credentials:
                  </p>

                  <div style="padding: 15px; background-color: #f8f9fa; border-left: 3px solid #7C3E8C; border-radius: 3px; margin-bottom: 15px;">
                    <p style="margin: 0 0 8px 0; color: #333; font-size: 13px;"><strong>Email:</strong> ${userEmail}</p>
                    <p style="margin: 0; color: #333; font-size: 13px;"><strong>Temporary Password:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 3px;">${tempPassword}</code></p>
                  </div>

                  <p style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.5;">
                    Before you can log in, please verify your email address by clicking the button below:
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 15px 0;">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #4A1D66 0%, #7C3E8C 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold;">
                          Verify Email & Activate Account
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="padding: 12px; background-color: #fff3cd; border-left: 3px solid #D4AF37; border-radius: 3px; margin-top: 15px;">
                    <p style="margin: 0; color: #856404; font-size: 12px; line-height: 1.4;">
                      ⚠️ <strong>Important:</strong> You'll be prompted to change your password upon first login.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 15px 25px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 6px 6px;">
                  <p style="margin: 0; color: #999999; font-size: 11px;">
                    © ${new Date().getFullYear()} SmartInventory. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
