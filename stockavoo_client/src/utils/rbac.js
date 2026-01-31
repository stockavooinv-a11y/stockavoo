/**
 * ROLE-BASED ACCESS CONTROL (RBAC) UTILITIES
 *
 * Frontend utilities for managing user roles and permissions.
 * Synced with backend RBAC implementation.
 */

// User Roles
export const ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  CLERK: 'clerk',
  ACCOUNTANT: 'accountant',
  WAREHOUSE_MANAGER: 'warehouse_manager',
};

// Role Display Names
export const ROLE_LABELS = {
  [ROLES.OWNER]: 'Store Owner',
  [ROLES.MANAGER]: 'Store Manager',
  [ROLES.CLERK]: 'Sales Clerk',
  [ROLES.ACCOUNTANT]: 'Accountant',
  [ROLES.WAREHOUSE_MANAGER]: 'Warehouse Manager',
};

// Role Descriptions
export const ROLE_DESCRIPTIONS = {
  [ROLES.OWNER]: 'Full access to all features. Can manage users, stores, and settings.',
  [ROLES.MANAGER]: 'Manages products, inventory, and suppliers. Can view reports.',
  [ROLES.CLERK]: 'Handles sales transactions and customer interactions.',
  [ROLES.ACCOUNTANT]: 'Manages expenses, generates financial reports, and reconciles payments.',
  [ROLES.WAREHOUSE_MANAGER]: 'Manages stock levels, receives deliveries, and handles stock transfers.',
};

// Role Badge Colors (for UI)
export const ROLE_COLORS = {
  [ROLES.OWNER]: 'bg-purple-100 text-purple-800',
  [ROLES.MANAGER]: 'bg-blue-100 text-blue-800',
  [ROLES.CLERK]: 'bg-green-100 text-green-800',
  [ROLES.ACCOUNTANT]: 'bg-yellow-100 text-yellow-800',
  [ROLES.WAREHOUSE_MANAGER]: 'bg-orange-100 text-orange-800',
};

/**
 * Role Permissions Matrix
 * Defines what each role can access
 */
export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: {
    users: ['create', 'read', 'update', 'delete'],
    stores: ['create', 'read', 'update', 'delete'],
    products: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'update', 'delete', 'refund'],
    suppliers: ['create', 'read', 'update', 'delete'],
    expenses: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    settings: ['read', 'update'],
    subscription: ['read', 'update'],
  },

  [ROLES.MANAGER]: {
    users: ['read'],
    stores: ['read'],
    products: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'refund'],
    suppliers: ['create', 'read', 'update', 'delete'],
    expenses: ['read'],
    reports: ['read', 'export'],
  },

  [ROLES.CLERK]: {
    products: ['read'],
    sales: ['create', 'read'],
  },

  [ROLES.ACCOUNTANT]: {
    products: ['read'],
    sales: ['read'],
    expenses: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    suppliers: ['read'],
  },

  [ROLES.WAREHOUSE_MANAGER]: {
    products: ['read', 'update'],
    suppliers: ['read', 'update'],
    sales: ['read'],
    reports: ['read'],
  },
};

/**
 * Check if user has specific role
 * @param {Object} user - User object with role property
 * @param {String|Array} roles - Role(s) to check
 * @returns {Boolean}
 */
export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
};

/**
 * Check if user has permission for a resource and action
 * @param {Object} user - User object with role property
 * @param {String} resource - Resource type (e.g., 'products', 'sales')
 * @param {String} action - Action type (e.g., 'create', 'read', 'update', 'delete')
 * @returns {Boolean}
 */
export const hasPermission = (user, resource, action) => {
  if (!user || !user.role) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource] || [];
  return resourcePermissions.includes(action);
};

/**
 * Check if user can access a feature
 * @param {Object} user - User object
 * @param {String} feature - Feature name
 * @returns {Boolean}
 */
export const canAccessFeature = (user, feature) => {
  if (!user || !user.role) return false;

  // Feature access map
  const featureAccess = {
    userManagement: [ROLES.OWNER],
    storeManagement: [ROLES.OWNER],
    productManagement: [ROLES.OWNER, ROLES.MANAGER],
    salesProcessing: [ROLES.OWNER, ROLES.MANAGER, ROLES.CLERK],
    supplierManagement: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAREHOUSE_MANAGER],
    expenseManagement: [ROLES.OWNER, ROLES.ACCOUNTANT],
    reporting: [ROLES.OWNER, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE_MANAGER],
    settings: [ROLES.OWNER],
    subscription: [ROLES.OWNER],
  };

  const allowedRoles = featureAccess[feature] || [];
  return allowedRoles.includes(user.role);
};

/**
 * Get all roles as options for select dropdown
 * @returns {Array} - Array of {value, label, description}
 */
export const getRoleOptions = () => {
  return Object.values(ROLES).map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
    description: ROLE_DESCRIPTIONS[role],
  }));
};

/**
 * Get role display name
 * @param {String} role - Role value
 * @returns {String} - Display name
 */
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

/**
 * Get role badge color classes
 * @param {String} role - Role value
 * @returns {String} - Tailwind CSS classes
 */
export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800';
};
