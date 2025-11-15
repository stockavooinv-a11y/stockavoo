# Stockavoo - Inventory Management System

## Project Overview
Stockavoo is a comprehensive inventory management system built with a modern tech stack.

**Purpose:** Manage inventory, track stock, handle multiple businesses, and user management.

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express v5
- **Database:** MongoDB (MongoDB Atlas)
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Email:** nodemailer (fully implemented)
- **Environment:** dotenv
- **Dev Tools:** nodemon

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4
- **Router:** React Router (to be configured)

---

## Project Structure

```
stockavoo/
├── server/                          # Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js         # MongoDB connection
│   │   │   └── email.js            # Nodemailer configuration
│   │   ├── controllers/
│   │   │   └── authController.js   # Authentication logic
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification & route protection
│   │   │   └── validators.js       # Request validation with express-validator
│   │   ├── models/
│   │   │   └── User.js             # User schema with Mongoose
│   │   ├── routes/
│   │   │   └── authRoutes.js       # Authentication endpoints
│   │   └── utils/
│   │       ├── jwt.js              # JWT token generation/verification
│   │       ├── passwordValidator.js # Password strength validation
│   │       ├── emailHelpers.js     # Email sending helper functions
│   │       └── emailTemplates.js   # HTML email templates
│   ├── .env                        # Environment variables (not in git)
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   ├── EMAIL_SETUP.md              # Email configuration guide
│   ├── package.json                # Backend dependencies
│   └── server.js                   # Express app entry point
│
└── stockavoo_client/                # Frontend React App
    ├── src/
    │   ├── App.jsx                 # Main app component
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Global styles
    ├── index.html                  # HTML template
    ├── package.json                # Frontend dependencies
    └── vite.config.js              # Vite configuration
```

---

## Completed Features

### ✅ User Authentication System (Commit: 6f596f0)
### ✅ Email Verification System (Commit: 43ae24d)

#### Backend API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/verify-email/:token` | Verify email with token | Public |
| POST | `/api/auth/resend-verification` | Resend verification email | Public |
| GET | `/api/auth/me` | Get current user profile | Private (JWT required) |
| GET | `/api/health` | Health check endpoint | Public |

#### Registration Validation Rules
- **Full Name:** Required, 2-50 characters, letters and spaces only
- **Email:** Required, valid email format, unique
- **Password:**
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 symbol (!@#$%^&*()_+-=[]{};\\'\":|,.<>?/)
- **Confirm Password:** Must match password
- **Phone Number:** Required, valid phone format
- **Terms Agreement:** Required, must be true

#### User Model Schema
```javascript
{
  fullName: String (required, 2-50 chars)
  email: String (required, unique, lowercase)
  phoneNumber: String (required)
  password: String (required, hashed, not returned in queries)
  role: String (enum: 'owner', 'manager', 'staff', default: 'owner')
  isVerified: Boolean (default: false)
  verificationToken: String
  verificationTokenExpires: Date
  passwordResetToken: String
  passwordResetExpires: Date
  authProvider: String (enum: 'local', 'google', 'facebook', 'tiktok', default: 'local')
  authProviderId: String
  profilePicture: String
  isActive: Boolean (default: true)
  agreedToTerms: Boolean (required: true)
  lastLogin: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

#### Security Features
- ✅ Passwords hashed with bcrypt (salt rounds: 12)
- ✅ JWT tokens for authentication (7-day expiration)
- ✅ Email verification tokens (24-hour expiration, hashed)
- ✅ Password reset tokens (1-hour expiration, hashed)
- ✅ Protected routes with JWT middleware
- ✅ Role-based access control
- ✅ Detailed validation with specific error messages

#### Error Response Format
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "Full name is required",
    "Please provide a valid email address"
  ],
  "details": [
    { "field": "fullName", "message": "Full name is required" },
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

#### Success Response Format
```json
{
  "status": "success",
  "message": "Registration successful!",
  "data": {
    "user": {
      "id": "...",
      "fullName": "...",
      "email": "...",
      "phoneNumber": "...",
      "role": "owner",
      "isVerified": false
    },
    "token": "jwt-token-here"
  }
}
```

---

## Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Frontend CORS
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=mailtrap  # or 'gmail' or 'smtp'
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@stockavoo.com
EMAIL_FROM_NAME=Stockavoo
```

**See `server/EMAIL_SETUP.md` for detailed email configuration instructions.**

---

## User Stories Implementation Status

### 📌 Registration & Authentication

#### ✅ Scenario 1: Registering via Form with Role Selection
- **Status:** Completed (without role selection - all users are owners by default)
- **Implementation:** POST `/api/auth/register`
- **Features:**
  - Full name, email, password, confirm password, phone number validation
  - Password strength validation (uppercase, lowercase, number, symbol)
  - Terms and conditions agreement required
  - Email verification token generated and sent via email
  - Beautiful HTML email templates
  - Welcome email sent after verification
  - Returns JWT token for immediate login

#### ✅ Scenario 2: Required Fields Validation
- **Status:** Completed
- **Implementation:** Express-validator middleware
- **Features:**
  - Field-by-field validation
  - Specific error messages for each field
  - All errors returned at once
  - Form-friendly error format with field names

#### ⏳ Scenario 3: Register Using Google
- **Status:** Not started
- **Next Steps:** Implement Google OAuth strategy

#### ⏳ Scenario 4: Register Using Facebook
- **Status:** Not started
- **Next Steps:** Implement Facebook OAuth strategy

#### ⏳ Scenario 5: Register Using TikTok
- **Status:** Not started
- **Next Steps:** Implement TikTok OAuth strategy

#### ✅ Scenario 6: Duplicate Email Error
- **Status:** Completed
- **Implementation:** MongoDB unique index + validation
- **Response:** "Email already in use"

---

## Testing

### Tested Endpoints

#### ✅ Registration Tests
- Valid registration: SUCCESS
- Duplicate email: REJECTED with proper error
- Weak password: REJECTED with specific requirements
- Missing fields: REJECTED with field-specific errors
- Password mismatch: REJECTED
- Invalid email format: REJECTED
- Terms not agreed: REJECTED

#### ✅ Login Tests
- Valid credentials: SUCCESS with JWT token
- Invalid credentials: REJECTED
- Empty fields: REJECTED with validation errors

### Sample Test Commands
```bash
# Valid registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#",
    "phoneNumber": "+1234567890",
    "agreedToTerms": true
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Get current user (protected route)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### ✅ Email Verification Features (Commit: 43ae24d)

#### Email Infrastructure
- **Multiple email service support:**
  - Gmail (with App Password)
  - Mailtrap (for testing - recommended)
  - Generic SMTP (SendGrid, Mailgun, etc.)
- **Email configuration verification** on server startup
- **Graceful error handling** - registration succeeds even if email fails

#### Email Templates
All emails feature professional, compact HTML design with:
- **Brand Colors:** Aubergine Luxury (#4A1D66 to #7C3E8C gradient with #D4AF37 gold accents)
- **Compact Design:** 30-40% smaller than typical emails, minimal scrolling required
- Responsive layout (mobile-friendly)
- Clear call-to-action buttons
- Expiration warnings
- Plain text fallback

**1. Verification Email**
- Subject: "Verify Your Email - Stockavoo"
- Contains verification link (valid for 24 hours)
- Sent immediately after registration

**2. Welcome Email**
- Subject: "Welcome to Stockavoo! 🎉"
- Sent after successful email verification
- Getting started tips and dashboard link

**3. Password Reset Email** (template ready)
- Subject: "Reset Your Password - Stockavoo"
- Contains reset link (valid for 1 hour)
- Ready for implementation

#### Email Endpoints
- **Registration** (`POST /api/auth/register`) - Sends verification email
- **Resend Verification** (`POST /api/auth/resend-verification`) - Sends new verification email
- **Email Verification** (`GET /api/auth/verify-email/:token`) - Sends welcome email

#### Configuration
- Comprehensive `EMAIL_SETUP.md` guide with:
  - Mailtrap setup (testing)
  - Gmail setup (development)
  - SendGrid setup (production)
  - Troubleshooting guide
  - Security best practices

---

## Pending Features

### High Priority
1. **OAuth Integration**
   - Google OAuth (passport-google-oauth20)
   - Facebook OAuth (passport-facebook)
   - TikTok OAuth (passport-tiktok)

3. **Frontend Registration Form**
   - Create registration page
   - Form validation with React Hook Form
   - Error display
   - Success handling
   - Redirect to login after verification

### Medium Priority
4. **Password Reset Flow**
   - Forgot password endpoint
   - Reset password endpoint
   - Email templates for reset

5. **User Profile Management**
   - Update profile endpoint
   - Change password endpoint
   - Upload profile picture

6. **Business Management** (Future)
   - Create business model
   - Business owner can create multiple businesses
   - Invite staff to businesses

---

## Development Commands

### Backend
```bash
cd server
npm install              # Install dependencies
npm run dev             # Start development server (nodemon)
npm start               # Start production server
```

### Frontend
```bash
cd stockavoo_client
npm install             # Install dependencies
npm run dev            # Start development server
npm run build          # Build for production
```

---

## Git Commits

| Commit | Date | Description |
|--------|------|-------------|
| `6f596f0` | Nov 2, 2025 | feat: Add user authentication system - Complete registration, login, validation, JWT auth |
| `7c6636e` | Nov 2, 2025 | docs: Add comprehensive project progress documentation |
| `43ae24d` | Nov 2, 2025 | feat: Implement email verification system with Nodemailer - Beautiful HTML templates, multiple service support |
| Latest | Nov 2, 2025 | feat: Update email templates with Aubergine Luxury brand and compact design |

---

## Notes & Decisions

### Design Decisions
1. **All users are business owners by default** - Role selection removed from registration as requested
2. **Business name not collected during registration** - Will be set up later when user creates their first business
3. **JWT returned on registration** - Allows immediate login after registration (even without email verification)
4. **Email verification optional for initial access** - Users can use app immediately but may need verification for certain features
5. **Express v5** - Using latest Express version (note: wildcard routes syntax changed)
6. **Compact UI Philosophy** - All designs prioritize information density, minimal padding, minimal scrolling
7. **Brand Identity** - Aubergine Luxury color scheme (deep purple #4A1D66 with gold #D4AF37 accents)

### Security Considerations
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire after 7 days
- Verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- Tokens stored hashed in database
- CORS configured for frontend origin
- `.env` file excluded from git

---

## API Response Standards

All API responses follow this format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "details": [
    { "field": "fieldName", "message": "Error message" }
  ]
}
```

---

## Database Information

### MongoDB Atlas Connection
- **Cluster:** cluster0.hmcqotl.mongodb.net
- **Database:** stockavoo (or as specified in MONGODB_URI)
- **Collections:**
  - `users` - User accounts

### Indexes
- `email` (unique) - Fast user lookup by email

---

## Next Steps

### Immediate Tasks
1. [x] Set up email verification (Nodemailer + email templates) ✅ COMPLETED
2. [ ] Configure email service (Mailtrap/Gmail) with actual credentials
3. [ ] Test email sending with real credentials
4. [ ] Build frontend registration form
5. [ ] Build frontend login form
6. [ ] Implement OAuth providers (Google, Facebook, TikTok)

### Future Tasks
1. [ ] Business model and multi-business support
2. [ ] Staff invitation system
3. [ ] Inventory models (products, categories, stock)
4. [ ] Dashboard implementation
5. [ ] Reporting and analytics

---

## Learning Resources Used

### Backend Concepts Explained
- **Middleware:** Functions that run between request and response (like security guards)
- **Controllers:** Business logic handlers (the "brain" of your API)
- **Models:** Database schemas/blueprints (define data structure)
- **Routes:** URL endpoints (like a restaurant menu)
- **JWT:** JSON Web Tokens for authentication (like a movie ticket)
- **Hashing:** One-way encryption for passwords (can't be reversed)
- **Validation:** Checking if data meets requirements before processing

### Key Packages & Their Purpose
- **express:** Web framework for building APIs
- **mongoose:** MongoDB ODM (makes database operations easier)
- **bcryptjs:** Password hashing
- **jsonwebtoken:** JWT creation and verification
- **express-validator:** Request validation
- **validator:** String validation (email, URLs, etc.)
- **nodemailer:** Email sending
- **cors:** Allow frontend to communicate with backend
- **dotenv:** Load environment variables

---

*Last Updated: November 2, 2025*
*Project Start Date: November 2, 2025*
