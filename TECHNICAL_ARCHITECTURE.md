# Stockavoo - Technical Architecture

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Planning Phase

---

## 🏗️ SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Web App (React + PWA)          Mobile App (React Native)   │
│  - Responsive Design             - iOS & Android            │
│  - Offline-First                 - Native Features          │
│  - Service Worker                - Push Notifications       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS / REST API
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     API GATEWAY LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  - Rate Limiting                                            │
│  - Authentication (JWT)                                     │
│  - Request Validation                                       │
│  - API Versioning (/api/v1)                                │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js                                       │
│  ┌──────────────┬──────────────┬──────────────┐           │
│  │   Auth       │   Business   │   Payments   │           │
│  │   Service    │   Logic      │   Service    │           │
│  └──────────────┴──────────────┴──────────────┘           │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary)    Redis (Cache)    S3 (Files)       │
│  - Structured Data       - Sessions       - Images          │
│  - ACID Compliance       - API Cache      - Documents       │
│  - Relational            - Queue          - Backups         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA (PostgreSQL)

### **Core Tables**

#### **users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    role_id UUID REFERENCES roles(id),
    business_id UUID REFERENCES businesses(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_business ON users(business_id);
```

#### **businesses**
```sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    tax_id VARCHAR(100),
    logo_url VARCHAR(500),
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    subscription_status VARCHAR(50) DEFAULT 'trial',
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **stores**
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stores_business ON stores(business_id);
```

#### **roles**
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-defined roles: Owner, Manager, Accountant, Sales Clerk
```

#### **products**
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    category_id UUID REFERENCES categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    cost_price DECIMAL(15, 2),
    selling_price DECIMAL(15, 2),
    reorder_level INTEGER DEFAULT 10,
    expiry_alert_days INTEGER DEFAULT 30,
    track_inventory BOOLEAN DEFAULT TRUE,
    has_variants BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_business ON products(business_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
```

#### **product_variants**
```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    attributes JSONB, -- {size: 'L', color: 'Red'}
    cost_price DECIMAL(15, 2),
    selling_price DECIMAL(15, 2),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
```

#### **inventory**
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    last_restock_date TIMESTAMP,
    last_count_date TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_inventory_unique ON inventory(store_id, product_id, variant_id);
CREATE INDEX idx_inventory_store ON inventory(store_id);
```

#### **sales_orders**
```sql
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    balance DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_business ON sales_orders(business_id);
CREATE INDEX idx_sales_store ON sales_orders(store_id);
CREATE INDEX idx_sales_date ON sales_orders(created_at);
```

#### **sales_order_items**
```sql
CREATE TABLE sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    discount DECIMAL(15, 2) DEFAULT 0,
    subtotal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON sales_order_items(sales_order_id);
```

#### **suppliers**
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    contact_person VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_suppliers_business ON suppliers(business_id);
```

#### **expenses**
```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id),
    category_id UUID REFERENCES expense_categories(id),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(100),
    receipt_url VARCHAR(500),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_business ON expenses(business_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
```

#### **notifications**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_business ON notifications(business_id);
```

#### **subscription_plans**
```sql
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    billing_period VARCHAR(50) DEFAULT 'monthly',
    features JSONB, -- {users: 5, stores: 1, orders: 100}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **audit_logs**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_business ON audit_logs(business_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### **JWT Token Structure**
```json
{
  "userId": "uuid",
  "businessId": "uuid",
  "role": "manager",
  "permissions": ["product.read", "product.write", "sales.create"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

### **Permission System**
```javascript
const PERMISSIONS = {
  // Product permissions
  'product.read': 'View products',
  'product.write': 'Create/edit products',
  'product.delete': 'Delete products',

  // Sales permissions
  'sales.create': 'Create sales orders',
  'sales.read': 'View sales orders',
  'sales.refund': 'Process refunds',

  // Inventory permissions
  'inventory.read': 'View inventory',
  'inventory.adjust': 'Adjust stock levels',

  // Reports permissions
  'reports.read': 'View reports',
  'reports.export': 'Export reports',

  // User management permissions
  'users.read': 'View users',
  'users.write': 'Manage users',
  'users.delete': 'Delete users',

  // Settings permissions
  'settings.read': 'View settings',
  'settings.write': 'Modify settings'
};
```

### **Role Definitions**
```javascript
const ROLES = {
  owner: {
    name: 'Owner',
    permissions: ['*'] // All permissions
  },
  manager: {
    name: 'Manager',
    permissions: [
      'product.*',
      'sales.*',
      'inventory.*',
      'reports.read',
      'reports.export',
      'suppliers.*'
    ]
  },
  accountant: {
    name: 'Accountant',
    permissions: [
      'sales.read',
      'expenses.*',
      'reports.*'
    ]
  },
  sales_clerk: {
    name: 'Sales Clerk',
    permissions: [
      'product.read',
      'sales.create',
      'sales.read',
      'inventory.read'
    ]
  }
};
```

---

## 🔄 API DESIGN

### **RESTful Endpoints**

#### **Authentication**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
POST   /api/v1/auth/verify-email/:token
POST   /api/v1/auth/resend-verification
GET    /api/v1/auth/me
```

#### **Users**
```
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
POST   /api/v1/users/invite
PUT    /api/v1/users/:id/role
PUT    /api/v1/users/:id/activate
PUT    /api/v1/users/:id/deactivate
```

#### **Stores**
```
GET    /api/v1/stores
GET    /api/v1/stores/:id
POST   /api/v1/stores
PUT    /api/v1/stores/:id
DELETE /api/v1/stores/:id
GET    /api/v1/stores/:id/metrics
```

#### **Products**
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
POST   /api/v1/products/:id/variants
PUT    /api/v1/products/:id/variants/:variantId
DELETE /api/v1/products/:id/variants/:variantId
POST   /api/v1/products/bulk-import
GET    /api/v1/products/export
```

#### **Inventory**
```
GET    /api/v1/inventory
GET    /api/v1/inventory/store/:storeId
POST   /api/v1/inventory/adjust
GET    /api/v1/inventory/low-stock
GET    /api/v1/inventory/expiring
POST   /api/v1/inventory/remove
GET    /api/v1/inventory/history/:productId
```

#### **Sales Orders**
```
GET    /api/v1/sales
GET    /api/v1/sales/:id
POST   /api/v1/sales
PUT    /api/v1/sales/:id
DELETE /api/v1/sales/:id
POST   /api/v1/sales/:id/refund
GET    /api/v1/sales/:id/invoice
POST   /api/v1/sales/:id/payment
```

#### **Suppliers**
```
GET    /api/v1/suppliers
GET    /api/v1/suppliers/:id
POST   /api/v1/suppliers
PUT    /api/v1/suppliers/:id
DELETE /api/v1/suppliers/:id
GET    /api/v1/suppliers/:id/history
```

#### **Reports**
```
GET    /api/v1/reports/end-of-day
GET    /api/v1/reports/sales-summary
GET    /api/v1/reports/inventory-summary
GET    /api/v1/reports/expenses-summary
GET    /api/v1/reports/profit-loss
GET    /api/v1/reports/export?type=sales&format=pdf
```

#### **Expenses**
```
GET    /api/v1/expenses
GET    /api/v1/expenses/:id
POST   /api/v1/expenses
PUT    /api/v1/expenses/:id
DELETE /api/v1/expenses/:id
GET    /api/v1/expenses/categories
```

#### **Notifications**
```
GET    /api/v1/notifications
GET    /api/v1/notifications/:id
PUT    /api/v1/notifications/:id/read
PUT    /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
```

### **Response Format**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### **Error Format**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 💾 CACHING STRATEGY (Redis)

### **Cache Keys**
```
# User session
session:${userId}

# API responses
api:${endpoint}:${params}

# Dashboard metrics
metrics:dashboard:${businessId}:${date}

# Reports
report:${type}:${businessId}:${dateRange}

# Product catalog
products:${businessId}:${storeId}

# Inventory counts
inventory:${storeId}
```

### **Cache TTL**
```javascript
{
  session: 7 * 24 * 60 * 60, // 7 days
  apiResponse: 5 * 60, // 5 minutes
  dashboardMetrics: 15 * 60, // 15 minutes
  reports: 60 * 60, // 1 hour
  productCatalog: 30 * 60, // 30 minutes
  inventory: 10 * 60 // 10 minutes
}
```

---

## 📱 OFFLINE MODE ARCHITECTURE

### **IndexedDB Schema**
```javascript
{
  stores: [
    'pendingSales', // Sales created offline
    'pendingExpenses', // Expenses created offline
    'pendingInventoryAdjustments',
    'cachedProducts', // Product catalog cache
    'cachedInventory', // Inventory cache
    'syncQueue' // Queue of operations to sync
  ]
}
```

### **Sync Queue Item**
```json
{
  "id": "uuid",
  "operation": "CREATE_SALE",
  "endpoint": "/api/v1/sales",
  "method": "POST",
  "data": {},
  "timestamp": 1234567890,
  "status": "pending",
  "retries": 0
}
```

### **Conflict Resolution**
```javascript
// Priority: Server data wins
if (serverTimestamp > localTimestamp) {
  return serverData;
} else {
  return localData;
}
```

---

## 🔒 SECURITY MEASURES

### **Authentication**
- JWT with short expiry (15 minutes access token)
- Refresh token (7 days)
- Password hashing with bcrypt (10 rounds)
- Email verification required
- Password reset with expiring tokens

### **Authorization**
- Role-based access control (RBAC)
- Permission-based authorization
- Row-level security (users can only access their business data)

### **API Security**
- Rate limiting (100 requests/minute per user)
- Request validation (Joi/Zod)
- SQL injection prevention (parameterized queries)
- XSS protection (helmet.js)
- CORS configuration
- HTTPS only

### **Data Security**
- Database encryption at rest
- SSL/TLS for data in transit
- Sensitive data masking in logs
- Regular backups (daily)
- Audit logging for all actions

---

## 📊 MONITORING & LOGGING

### **Metrics to Track**
- API response times
- Error rates
- Active users
- Database query performance
- Cache hit rates
- Payment success rates
- Sync operation success rates

### **Logging Levels**
```javascript
{
  error: 'Critical errors',
  warn: 'Warning messages',
  info: 'Informational messages',
  http: 'HTTP requests',
  debug: 'Debug information'
}
```

### **Alerts**
- API response time > 2s
- Error rate > 1%
- Database connection failures
- Payment failures
- Uptime < 99.9%

---

## 🚀 DEPLOYMENT ARCHITECTURE

### **Environment Configuration**
```
Development  -> Local machine
Staging      -> AWS/Azure staging
Production   -> AWS/Azure production
```

### **CI/CD Pipeline**
```
Push to GitHub
    ↓
Run Tests (Jest, Cypress)
    ↓
Build Application
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production (manual approval)
```

### **Infrastructure**
```
Load Balancer (ELB/Azure LB)
    ↓
App Servers (EC2/Azure VMs) - Auto-scaling
    ↓
Database (RDS PostgreSQL/Azure SQL)
    ↓
Cache (ElastiCache Redis/Azure Cache)
    ↓
Storage (S3/Azure Blob)
```

---

## 📈 SCALABILITY CONSIDERATIONS

### **Horizontal Scaling**
- Stateless API servers
- Load balancer distribution
- Database read replicas
- Redis cluster for caching

### **Vertical Scaling**
- Database instance upgrades
- Increase cache memory
- Optimize queries

### **Performance Optimization**
- Database indexing
- Query optimization
- API response caching
- Image optimization (CDN)
- Lazy loading on frontend
- Code splitting
- Gzip compression

---

## 🧪 TESTING STRATEGY

### **Unit Tests**
- Test individual functions
- Mock external dependencies
- Target: 80% code coverage

### **Integration Tests**
- Test API endpoints
- Test database operations
- Test third-party integrations

### **E2E Tests**
- Test critical user flows
- Test across different browsers
- Test on mobile devices

### **Performance Tests**
- Load testing (100K+ transactions)
- Stress testing
- Database query performance

---

**Last Updated:** January 2026
**Next Review:** After Sprint 2
