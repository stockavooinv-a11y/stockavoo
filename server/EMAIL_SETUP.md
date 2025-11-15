# Email Setup Guide for Stockavoo

This guide will help you configure email sending for user verification emails.

---

## Quick Start (Recommended for Testing)

For development and testing, we recommend using **Mailtrap** - it captures all emails so you can test without actually sending them.

### Option 1: Mailtrap (Testing - No Real Emails Sent)

**Best for:** Development and testing

1. **Sign up for Mailtrap** (Free)
   - Go to https://mailtrap.io
   - Create a free account
   - Navigate to "Email Testing" → "Inboxes"

2. **Get Your Credentials**
   - Click on your inbox
   - Under "SMTP Settings", you'll see:
     - Host: `smtp.mailtrap.io`
     - Port: `2525` or `25` or `465` or `587`
     - Username: (looks like a random string)
     - Password: (looks like a random string)

3. **Update Your `.env` File**
   ```env
   EMAIL_SERVICE=mailtrap
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   EMAIL_FROM=noreply@stockavoo.com
   EMAIL_FROM_NAME=Stockavoo
   ```

4. **Test It!**
   - Restart your server
   - Register a new user
   - Check your Mailtrap inbox - the email will appear there!

---

## Production Options

### Option 2: Gmail (Real Emails)

**Best for:** Development with real emails, small-scale testing

**⚠️ Important:** You MUST use an App Password, not your regular Gmail password.

#### Steps:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Security → 2-Step Verification → Turn On

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Stockavoo"
   - Click "Generate"
   - **Copy the 16-character password** (you won't see it again!)

3. **Update Your `.env` File**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=Stockavoo
   ```

4. **Test It!**
   - Restart your server
   - Register a new user with a real email
   - Check the email inbox!

**Limitations:**
- Gmail has a daily sending limit (500 emails/day for free accounts)
- Not recommended for production with many users

---

### Option 3: SendGrid (Production)

**Best for:** Production environments with high email volume

#### Steps:

1. **Sign Up for SendGrid**
   - Go to https://sendgrid.com
   - Create a free account (100 emails/day free)

2. **Create API Key**
   - Go to Settings → API Keys
   - Create API Key
   - Give it "Full Access" or "Mail Send" access
   - **Copy the API key** (you won't see it again!)

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Verify a single sender (for free tier)
   - Or verify a domain (requires DNS setup)

4. **Update Your `.env` File**
   ```env
   EMAIL_SERVICE=smtp
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=your-verified-email@yourdomain.com
   EMAIL_FROM_NAME=Stockavoo
   ```

---

### Option 4: Other SMTP Services

You can use any SMTP service (Mailgun, Amazon SES, Postmark, etc.)

**Update `.env` with your SMTP credentials:**
```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.yourservice.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Stockavoo
```

---

## Troubleshooting

### Email Configuration Error on Startup

If you see this error when starting the server:
```
❌ Email service configuration error
📧 Emails will not be sent. Please check your .env configuration.
```

**Solution:**
1. Check that all email environment variables are set in `.env`
2. Verify your credentials are correct
3. For Gmail, make sure you're using an App Password (not your regular password)
4. For Mailtrap, copy the exact credentials from their dashboard

### Emails Not Being Received

**Mailtrap:**
- Check your Mailtrap inbox (not your real email!)
- Emails appear in the Mailtrap dashboard

**Gmail:**
- Check spam folder
- Verify App Password is correct
- Make sure 2FA is enabled on your Gmail account

**SendGrid/Other Services:**
- Check sender verification is complete
- Verify API key has correct permissions
- Check your email service dashboard for error logs

### Testing Email Configuration

You can test your email setup with this endpoint (add it temporarily):

```javascript
// In authRoutes.js
import { sendTestEmail } from '../utils/emailHelpers.js';

router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    await sendTestEmail(email);
    res.json({ message: 'Test email sent! Check your inbox.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Test it:
```bash
curl -X POST http://localhost:5000/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

---

## Email Templates

The system sends these emails:

1. **Verification Email** - Sent after registration
   - Subject: "Verify Your Email - Stockavoo"
   - Contains verification link (valid for 24 hours)

2. **Welcome Email** - Sent after email verification
   - Subject: "Welcome to Stockavoo! 🎉"
   - Welcome message with getting started tips

3. **Password Reset Email** - Sent when user requests password reset (to be implemented)
   - Subject: "Reset Your Password - Stockavoo"
   - Contains reset link (valid for 1 hour)

---

## Security Best Practices

1. **Never commit `.env` file**
   - It's already in `.gitignore`
   - Use `.env.example` as a template

2. **Use App Passwords for Gmail**
   - Never use your actual Gmail password
   - App Passwords are more secure and can be revoked

3. **Rotate Credentials Regularly**
   - Change API keys and passwords periodically
   - Especially if they may have been exposed

4. **Use Environment-Specific Configs**
   - Development: Mailtrap (testing)
   - Production: SendGrid/Mailgun (real emails)

---

## What Happens When Email Fails?

- **Registration still succeeds** - User is created in database
- **Error is logged** - Check server console for details
- **User can resend** - Use the "Resend Verification Email" endpoint
- **Server continues running** - Email failure doesn't crash the server

---

## Next Steps After Setup

1. Start your server: `npm run dev`
2. Look for this message:
   ```
   ✅ Email service is configured and ready to send emails
   ```
3. Register a new user
4. Check for the verification email:
   - Mailtrap: Check Mailtrap dashboard
   - Gmail/Other: Check your email inbox

---

## Need Help?

- **Mailtrap Issues:** https://help.mailtrap.io
- **Gmail Issues:** https://support.google.com/accounts
- **SendGrid Issues:** https://docs.sendgrid.com

---

*Last Updated: November 2, 2025*
