# Stockavoo/SmartInventory - Task List by User Roles

**Project:** SmartInventory (Stockavoo)
**Target MVP Release:** December 2025
**Document Generated:** January 2026

---

## 📋 TASK CATEGORIES BY USER ROLE

This task list is organized based on **user roles** (personas) to align development with actual business workflows and user needs.

---

## 👤 1. RETAIL STORE OWNER

**Description:** Operates small to medium physical stores. Needs to manage multiple store locations, view reports, control user access, and make strategic decisions.

### **Authentication & Onboarding**
- [x] ~~User registration and login~~
- [x] ~~Email verification~~
- [x] ~~Password reset functionality~~
- [x] ~~User profile management~~
- [x] ~~Token-based user invitation flow~~
- [ ] Business profile setup and configuration
- [ ] Onboarding wizard for new store setup

### **Store Management**
- [ ] Create and register new stores
- [ ] Manage multiple store locations (1–7 based on subscription)
- [ ] View store performance metrics
- [ ] Switch between different stores
- [ ] Configure store settings (name, address, tax settings)
- [ ] Manage store-level configurations

### **User & Role Management**
- [x] ~~Add/remove staff users (1–15 based on subscription plan)~~
- [x] ~~Assign roles to users (Store Manager, Accountant, Sales Clerk, etc.)~~
- [x] ~~Configure role-based permissions (RBAC)~~
- [ ] View user activity logs
- [x] ~~Deactivate/activate user accounts~~
- [x] ~~Invite users to the system~~
- [x] ~~View users list with filters (role, status)~~
- [x] ~~Edit user information~~
- [x] ~~Owner role excluded from invitations~~

### **Dashboard & Analytics**
- [x] ~~View main dashboard with key metrics~~
- [ ] View sales summary across all stores
- [ ] View total inventory value
- [ ] View profit & loss (P&L) overview
- [ ] View recent activity feed
- [ ] View low stock alerts
- [ ] Filter dashboard by date range and store
- [ ] Compare store performance (multi-store view)

### **Reporting & Business Intelligence**
- [ ] Generate End-of-Day reports
- [ ] Generate sales reports (daily, weekly, monthly)
- [ ] Generate inventory reports
- [ ] Generate expense reports
- [ ] Generate profit & loss (P&L) reports
- [ ] Export reports in CSV/PDF format
- [ ] Create advanced analytics dashboard (Phase 2)
- [ ] Create custom report builder (Phase 2)

### **Subscription & Billing Management**
- [ ] View current subscription plan
- [ ] View plan features and limits
- [ ] Upgrade/downgrade subscription plan
- [ ] View billing history
- [ ] Manage payment methods
- [ ] View usage metrics (sales orders, users, stores)

### **Notifications & Alerts**
- [ ] Receive reorder alerts for low stock
- [ ] Receive expiry alerts for products near expiration
- [ ] Receive low stock notifications
- [ ] Configure notification preferences
- [ ] View notification history

### **Advanced Features (Phase 2+)**
- [ ] Enable credit tracking for customers
- [ ] View reconciliation dashboard
- [ ] Manage stock transfers between stores (multi-store)
- [ ] Access CRM dashboard
- [ ] Create customer segments for marketing
- [ ] Launch email/SMS campaigns
- [ ] Manage loyalty programs
- [ ] Manage gift cards
- [ ] Configure e-commerce integration

---

## 🏪 2. STORE MANAGER

**Description:** Oversees daily stock operations, sales processing, supplier coordination, and ensures smooth day-to-day store operations.

### **Product & Inventory Management**
- [ ] Add new products to inventory
- [ ] Edit existing product details
- [ ] Delete products from inventory
- [ ] Manage product variants (size, color, etc.)
- [ ] Upload product images
- [ ] Organize products by categories
- [ ] Import products in bulk (CSV upload)
- [ ] Set low stock alert thresholds
- [ ] Track product expiry dates
- [ ] Remove expired or damaged stock
- [ ] Scan product barcodes/SKUs
- [ ] Export inventory data (CSV/PDF)

### **Supplier Management**
- [ ] Add new suppliers
- [ ] Edit supplier information
- [ ] View supplier details and contact info
- [ ] View supplier purchase history
- [ ] Reorder products from suppliers
- [ ] Track supplier deliveries
- [ ] Manage supplier contacts

### **Stock Operations**
- [ ] Receive stock from suppliers
- [ ] Update stock levels manually
- [ ] Remove damaged/expired stock
- [ ] View stock movement history
- [ ] Transfer stock between stores (Phase 2)
- [ ] Conduct stock audits
- [ ] Reconcile stock discrepancies

### **Notifications & Alerts**
- [ ] Receive low stock reorder alerts
- [ ] Receive expiry date alerts
- [ ] Configure reorder thresholds
- [ ] View notification center

### **Reporting**
- [ ] Generate End-of-Day inventory reports
- [ ] View inventory summary
- [ ] Export inventory data

---

## 🛒 3. SALES CLERK

**Description:** Handles point-of-sale transactions, product returns, customer inquiries, and daily sales operations.

### **Sales Order Processing**
- [ ] Create new sales order (POS-like interface)
- [ ] Search for products in sales interface
- [ ] Add products to cart
- [ ] Remove products from cart
- [ ] Update product quantities in cart
- [ ] Select payment method (Cash, Card, Transfer, etc.)
- [ ] Process split payments (Phase 2)
- [ ] Generate and print invoices/receipts
- [ ] View sales order details
- [ ] Process refunds and returns
- [ ] Hold order for later completion (Phase 2)
- [ ] View order history

### **Inventory Checks**
- [ ] Check product stock availability during sales
- [ ] View product details (price, variants)
- [ ] Scan product barcodes during checkout

### **Customer Interaction**
- [ ] Look up customer purchase history (Phase 2)
- [ ] Apply customer loyalty rewards (Phase 2)
- [ ] Issue gift cards (Phase 2)

### **Offline Mode**
- [ ] Process sales orders offline
- [ ] View offline mode indicator
- [ ] Sync offline transactions when online
- [ ] View sync status

---

## 💰 4. ACCOUNTANT / FINANCE OFFICER

**Description:** Generates end-of-day reports, reconciles payments, monitors expenses, and ensures financial accuracy.

### **Financial Reporting**
- [ ] Generate End-of-Day (EOD) reports
- [ ] View daily sales summary
- [ ] View daily expenses summary
- [ ] Generate profit & loss (P&L) reports
- [ ] Export financial reports (CSV/PDF)
- [ ] View sales trends and analytics
- [ ] Create custom financial reports (Phase 2)

### **Payment Reconciliation**
- [ ] View all payment transactions
- [ ] Reconcile payments to sales orders
- [ ] Match bank deposits to sales
- [ ] Identify payment discrepancies
- [ ] Export reconciliation reports (Phase 2)

### **Expense Management**
- [ ] Add new expenses
- [ ] Edit expense details
- [ ] Categorize expenses (rent, utilities, salaries, etc.)
- [ ] View expense summary
- [ ] Filter expenses by date, category, store
- [ ] Export expense reports

### **Credit & Debt Tracking (Phase 2)**
- [ ] Track customer credit/debts
- [ ] View outstanding payments
- [ ] Record debt payments
- [ ] Send payment reminders to customers

### **Audit & Compliance**
- [ ] View audit logs for user actions
- [ ] Track inventory adjustments
- [ ] Monitor subscription usage limits

---

## 📦 5. WAREHOUSE MANAGER

**Description:** Manages stock levels, reorder alerts, bulk transfers between branches, and warehouse operations.

### **Warehouse Operations**
- [ ] Receive bulk stock deliveries
- [ ] Update stock quantities in bulk
- [ ] Organize stock by warehouse zones
- [ ] Track stock movement in/out of warehouse
- [ ] Conduct regular stock audits

### **Stock Transfers (Multi-Store)**
- [ ] Transfer stock between store locations (Phase 2)
- [ ] Create stock transfer requests
- [ ] Approve stock transfer requests
- [ ] Track stock transfer history
- [ ] Reconcile transferred stock

### **Reorder Management**
- [ ] View low stock alerts
- [ ] Configure automatic reorder thresholds
- [ ] Create purchase orders for suppliers
- [ ] Track pending supplier orders
- [ ] Receive and confirm supplier deliveries

### **Inventory Tracking**
- [ ] View real-time stock levels across all locations
- [ ] Track product expiry dates
- [ ] Remove expired/damaged inventory
- [ ] Generate inventory reports
- [ ] Export inventory data

---

## 💊 6. PHARMACY OWNER / MANAGER

**Description:** Needs prescription management, expiry tracking, and specialized pharmacy inventory features.

### **Prescription Management (Phase 3)**
- [ ] Add prescriptions linked to sales
- [ ] Track prescription history
- [ ] Verify prescription authenticity
- [ ] Link prescriptions to customers
- [ ] Generate prescription reports

### **Pharmacy-Specific Inventory**
- [ ] Track controlled substances (drug schedules)
- [ ] Monitor drug expiry dates (critical for pharmacy)
- [ ] Set strict expiry alerts for medications
- [ ] Manage batch numbers and lot tracking
- [ ] Track drug interactions (future enhancement)

### **Regulatory Compliance**
- [ ] Generate regulatory reports
- [ ] Track prescription data for audits
- [ ] Maintain prescription data privacy (HIPAA-like compliance)

---

## 🍽️ 7. RESTAURANT MANAGER

**Description:** Requires table management, kitchen display, recipe tracking, and restaurant-specific operations.

### **Table & Order Management (Phase 3)**
- [ ] Manage restaurant tables
- [ ] Assign orders to tables
- [ ] Track table occupancy
- [ ] Split bills by table/person
- [ ] Process dine-in, takeout, and delivery orders

### **Kitchen Display System**
- [ ] Send orders to kitchen display
- [ ] Track order preparation status
- [ ] Mark orders as ready for serving
- [ ] View real-time kitchen order queue

### **Recipe Management**
- [ ] Create recipes with ingredient lists
- [ ] Track recipe costs
- [ ] Link recipes to menu items
- [ ] Automatically deduct inventory based on recipes sold
- [ ] Calculate recipe profitability

### **Restaurant Reporting**
- [ ] Generate daily sales by menu item
- [ ] Track popular menu items
- [ ] Monitor food waste and inventory loss
- [ ] Calculate ingredient usage

---

## 🛠️ TECHNICAL IMPLEMENTATION (Cross-Functional)

This section covers technical tasks required to support all user roles above.

### **Frontend Development (React.js)**

#### **Core Setup**
- [x] ~~Set up React project with Vite~~
- [x] ~~Install and configure Tailwind CSS~~
- [x] ~~Install Lucide React icons~~
- [x] ~~Set up Redux Toolkit for state management~~
- [x] ~~Set up RTK Query for API calls~~
- [x] ~~Create reusable Input component~~
- [x] ~~Create reusable Button component~~
- [x] ~~Create reusable ConfirmationModal component~~

#### **Authentication Pages**
- [x] ~~Create Login page with modern design~~
- [x] ~~Create Register page with modern design~~
- [x] ~~Create Forgot Password page~~
- [x] ~~Create Reset Password page~~
- [x] ~~Create Email Verification page~~
- [x] ~~Create Verification Waiting page~~
- [x] ~~Implement password visibility toggle~~
- [x] ~~Implement form validation~~
- [x] ~~Implement auth slice (login, logout, register)~~
- [x] ~~Implement protected routes~~
- [x] ~~Implement email verification flow~~
- [x] ~~Create VerificationBanner component~~

#### **Core Application Pages**
- [x] ~~Create main Dashboard layout with sidebar~~
- [x] ~~Create stat cards component~~
- [x] ~~Create quick actions component~~
- [x] ~~Implement responsive mobile sidebar~~
- [x] ~~Implement user profile management page~~
- [x] ~~Create Modal component with glassmorphism~~
- [x] ~~Create Table component with sorting, filtering, export~~
- [x] ~~Implement RBAC UI for user/role management~~
- [x] ~~Create user list/management page~~
- [x] ~~Create add/edit user modal~~
- [x] ~~Implement change password functionality~~
- [ ] Implement user settings page
- [ ] Create store management pages
- [ ] Create product management pages
- [ ] Create sales order (POS) interface
- [ ] Create supplier management pages
- [ ] Create reporting pages
- [ ] Create expense tracking pages
- [ ] Create notification center
- [ ] Create settings pages
- [ ] Implement offline mode (PWA with service workers)

---

### **Backend Development (Node.js/Express)**

#### **Infrastructure Setup**
- [x] ~~Initialize Node.js project~~
- [x] ~~Set up Express server~~
- [x] ~~Configure environment variables~~
- [x] ~~Set up MongoDB connection~~ *(PRD specifies PostgreSQL - migration needed)*
- [ ] **CRITICAL: Migrate from MongoDB to PostgreSQL**
- [ ] Set up Redis for caching
- [ ] Configure AWS/Azure deployment
- [ ] Set up S3 for file storage
- [ ] Configure HTTPS and SSL certificates
- [ ] Set up monitoring (error tracking, performance)

#### **Authentication & Authorization**
- [x] ~~Implement user registration endpoint~~
- [x] ~~Implement login endpoint~~
- [x] ~~Implement JWT authentication~~
- [x] ~~Implement password hashing (bcrypt)~~
- [x] ~~Implement forgot password endpoint~~
- [x] ~~Implement reset password endpoint~~
- [x] ~~Implement email verification endpoint~~
- [x] ~~Implement resend verification email~~
- [x] ~~Set up email service (Nodemailer/Brevo)~~
- [x] ~~Implement token-based account setup endpoint~~
- [x] ~~Implement change password endpoint~~
- [ ] Implement refresh token mechanism
- [x] ~~Implement RBAC middleware~~
- [ ] Create audit log system

#### **Core API Endpoints**
- [x] ~~User management CRUD endpoints~~
- [x] ~~User invitation endpoint with email setup link~~
- [x] ~~Update own profile endpoint~~
- [x] ~~Change password endpoint~~
- [ ] Store management CRUD endpoints
- [ ] Product & inventory CRUD endpoints
- [ ] Sales order CRUD endpoints
- [ ] Supplier CRUD endpoints
- [ ] Expense CRUD endpoints
- [ ] Reporting endpoints
- [ ] Notification system endpoints
- [ ] Subscription & billing endpoints

#### **Database Design**
- [ ] Design PostgreSQL schemas for all entities
- [ ] Create database migrations system
- [ ] Implement database indexes for performance
- [ ] Set up backup strategy

#### **Security & Performance**
- [ ] Implement rate limiting
- [ ] Implement API validation (Joi/Zod)
- [ ] Set up CORS properly
- [ ] Implement error handling middleware
- [ ] Optimize database queries

---

## 🎨 DESIGN & UI/UX (@akorodeolawole)

### **Phase 1: MVP Core Design**
- [ ] Design all authentication screens
- [ ] Design onboarding flow for new users
- [ ] Create dashboard wireframes
- [ ] Design product management interface
- [ ] Design sales order (POS) interface
- [ ] Design supplier management module
- [ ] Design reporting interfaces
- [ ] Design expense tracking module
- [ ] Design notification center
- [ ] Design role-based permission settings UI
- [ ] Design store management interface
- [ ] Create responsive layouts (mobile, tablet, desktop)
- [ ] Design offline mode indicators

### **Phase 2: Enhanced Features**
- [ ] Design split payment interface
- [ ] Design advanced reporting dashboard
- [ ] Design reconciliation workflow UI
- [ ] Design credit tracking interface

### **Phase 3: Future Modules**
- [ ] Design prescription management (Pharmacy)
- [ ] Design CRM interface
- [ ] Design loyalty program management
- [ ] Design e-commerce storefront
- [ ] Design restaurant tables & kitchen display
- [ ] Design recipe management interface

---

## 🧪 QA & TESTING (@OTTIS JENNIFER)

### **Test Planning & Strategy**
- [ ] Create test plan for each user role
- [ ] Define test cases for all MVP features
- [ ] Create test data sets for different user personas
- [ ] Set up test environments (staging)

### **Role-Based Testing**
- [ ] Test Retail Store Owner workflows
- [ ] Test Store Manager workflows
- [ ] Test Sales Clerk workflows
- [ ] Test Accountant/Finance Officer workflows
- [ ] Test Warehouse Manager workflows
- [ ] Test role-based access control (RBAC)

### **Feature Testing**
- [ ] Test authentication and onboarding
- [ ] Test product & inventory management
- [ ] Test sales order processing (POS)
- [ ] Test supplier management
- [ ] Test reporting & analytics
- [ ] Test expense tracking
- [ ] Test notifications system
- [ ] Test offline mode and sync
- [ ] Test subscription plan limits

### **Automated & Performance Testing**
- [ ] Set up unit testing (Jest/Mocha)
- [ ] Set up integration testing
- [ ] Set up end-to-end testing (Cypress/Playwright)
- [ ] Test API response times (<2s target)
- [ ] Load testing (100K+ monthly transactions)

### **Security & UAT**
- [ ] Test authentication and authorization
- [ ] Test data privacy compliance
- [ ] Coordinate beta testing with 50 SMEs
- [ ] Collect user feedback
- [ ] Create UAT report

---

## 📝 DOCUMENTATION (@akorodeolawole @OTTIS JENNIFER)

### **Technical Documentation**
- [ ] Document API endpoints (Swagger/Postman)
- [ ] Create database schema documentation
- [ ] Document deployment guide
- [ ] Create project setup guide

### **User Documentation**
- [ ] Create user manual by role (Store Owner, Manager, Clerk, etc.)
- [ ] Write getting started guide
- [ ] Create feature-specific tutorials
- [ ] Create FAQ section
- [ ] Create video tutorials/demos

---

## 🚀 DEVOPS & DEPLOYMENT

### **Infrastructure**
- [ ] Set up AWS/Azure hosting
- [ ] Configure PostgreSQL database (RDS/Azure SQL)
- [ ] Set up Redis for caching
- [ ] Configure S3/Blob storage
- [ ] Set up monitoring and error tracking

### **CI/CD & Security**
- [ ] Set up GitHub Actions/GitLab CI
- [ ] Configure automated testing pipeline
- [ ] Set up automated deployment
- [ ] Configure SSL certificates
- [ ] Implement backup and disaster recovery

---

## 📊 PRODUCT MANAGEMENT & GO-TO-MARKET

### **Product Strategy**
- [ ] Finalize subscription plan pricing
- [ ] Define plan feature matrix
- [ ] Create product roadmap
- [ ] Prioritize feature backlog

### **Go-To-Market**
- [ ] Recruit 50 SMEs for beta testing
- [ ] Create marketing materials
- [ ] Create demo videos
- [ ] Set up helpdesk/support system
- [ ] Set up 14-day free trial system

---

## 🎯 PRIORITY MATRIX (By User Role Focus)

### **P0 - Critical (MVP Blockers) - Core User Roles**
**Focus: Retail Store Owner, Store Manager, Sales Clerk**
- Authentication & user management
- Store management (single store for MVP)
- Product management with variants
- Sales order processing (POS interface)
- Basic inventory tracking
- End-of-Day reporting

### **P1 - High Priority (MVP Core)**
**Focus: Store Manager, Accountant, Warehouse Manager**
- Supplier management
- Expense tracking
- Reorder & expiry notifications
- Stock removal functionality
- Inventory export
- Role-based access control (RBAC)

### **P2 - Medium Priority (MVP Enhanced)**
**Focus: Advanced Store Owner, Accountant**
- Offline mode (PWA)
- Split payments
- Advanced reporting & analytics
- Multi-store support (Pro/Enterprise plans)

### **P3 - Low Priority (Phase 2+)**
**Focus: Specialized Roles (Pharmacy, Restaurant)**
- Credit tracking & reconciliation (Accountant)
- CRM features (Store Owner)
- Loyalty programs (Store Owner)
- E-commerce integration (Store Owner)
- Pharmacy module (Pharmacy Owner)
- Restaurant module (Restaurant Manager)

---

## 📅 CURRENT STATUS SUMMARY

### ✅ Completed
**User Roles Supported:** Retail Store Owner (Full authentication, profile, user management)
- Frontend: React + Tailwind CSS setup
- Authentication pages (Login, Register, Password Reset, Email Verification, Setup Account)
- Email verification workflow
- Token-based user invitation flow
- Protected routes with RBAC
- Redux Toolkit + RTK Query setup
- Basic dashboard layout with sidebar
- User profile management page
- User list/management page with filters
- Add/Edit user modal
- Change password functionality
- Reusable components (Table, Modal, Button, Input)
- Backend: Full authentication system (registration, login, verification, password reset/change)
- Backend: User management CRUD with RBAC
- Backend: Email service with Brevo SMTP

### 🔄 In Progress
- None currently

### ⏳ Next Up - Recommended Development Order by User Role

#### **IMMEDIATE NEXT TASK (Choose One):**
**Option A: Store Management (RECOMMENDED)**
- Create and configure stores
- Foundation for inventory and multi-store workflows
- **Impact:** Unlocks Product Management and Store-specific operations
- **Files to create:** Store management UI, store CRUD endpoints, store model

**Option B: Product Management**
- Add, edit, delete products
- Manage product variants (size, color, etc.)
- **Impact:** Core feature needed before sales processing
- **Files to create:** Product management UI, product CRUD endpoints, product model

**Option C: Database Migration (TECHNICAL DEBT)**
- Migrate MongoDB → PostgreSQL (PRD requirement)
- **Impact:** Avoids future migration complexity
- **Effort:** High (schema redesign, data migration, testing)

---

#### **Phase 1: Core Retail Store Owner & Store Manager Features**
1. ✅ ~~Authentication & email verification~~
2. ✅ ~~User & Role Management - Store Owner adds users with roles~~
3. **👉 NEXT: Store Management** - Single store creation and configuration (RECOMMENDED)
4. **Product Management** - Store Manager can add/edit/delete products with variants

#### **Phase 2: Sales Clerk & Store Manager Operations**
5. **Sales Order Processing** - Sales Clerk POS interface
6. **Supplier Management** - Store Manager can manage suppliers
7. **Inventory Tracking** - Automatic stock updates after sales

#### **Phase 3: Accountant & Reporting**
8. **Expense Tracking** - Accountant can add/view expenses
9. **End-of-Day Reporting** - Accountant can generate EOD reports
10. **Notifications** - Reorder & expiry alerts for Store Manager

---

## 📌 CRITICAL ISSUES TO RESOLVE

1. **Database Mismatch**: PRD specifies PostgreSQL, current uses MongoDB
2. **Subscription System**: Not implemented - needed for role/feature restrictions
3. **Multi-Store Support**: Not in MVP for Starter/Basic plans (Pro+ only)
4. **Payment Gateway**: Not yet integrated (Paystack/Flutterwave)
5. **Offline Mode**: Requires PWA setup and IndexedDB
6. **Email Service**: Currently failing on Render (SMTP port blocked on free tier)

---

## 📊 SUMMARY

**Organization:** Task list now organized by **user roles** (Retail Store Owner, Store Manager, Sales Clerk, Accountant, Warehouse Manager, Pharmacy Owner, Restaurant Manager)

**Total Tasks:** ~200+ tasks organized by persona workflows

**Estimated Timeline:**
- MVP (Core Roles: Owner, Manager, Clerk, Accountant): 6-9 months
- Full v1 (All Roles + Advanced Features): 12-18 months

**Key Insight:** This organization aligns development with actual user workflows, making it easier to:
- Prioritize features based on user needs
- Test by user role scenarios
- Build incrementally for each persona
- Communicate progress to stakeholders
