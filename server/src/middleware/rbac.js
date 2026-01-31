/**
 * ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE
 *
 * This middleware controls access to routes based on user roles.
 * It ensures users can only access features allowed for their role.
 */

/**
 * Role Permissions Matrix
 * Defines what each role can do
 */
export const ROLE_PERMISSIONS = {
  owner: {
    // Store Owner has full access to everything
    users: ['create', 'read', 'update', 'delete'],
    stores: ['create', 'read', 'update', 'delete'],
    products: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'update', 'delete', 'refund'],
    suppliers: ['create', 'read', 'update', 'delete'],
    expenses: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    settings: ['read', 'update'],
    subscription: ['read', 'update']
  },

  manager: {
    // Store Manager can manage products, inventory, suppliers
    users: ['read'], // Can view users but not manage them
    stores: ['read'],
    products: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'refund'],
    suppliers: ['create', 'read', 'update', 'delete'],
    expenses: ['read'],
    reports: ['read', 'export']
  },

  clerk: {
    // Sales Clerk focuses on POS operations
    products: ['read'], // View products for sales
    sales: ['create', 'read'], // Process sales, view history
    expenses: [],
    reports: []
  },

  accountant: {
    // Accountant handles financial reporting
    products: ['read'],
    sales: ['read'],
    expenses: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    suppliers: ['read']
  },

  warehouse_manager: {
    // Warehouse Manager handles stock operations
    products: ['read', 'update'], // Can update stock levels
    suppliers: ['read', 'update'], // Can receive deliveries
    sales: ['read'],
    reports: ['read']
  }
};

/**
 * Middleware to check if user has required role
 * @param {Array} allowedRoles - Array of roles allowed to access route
 * @returns {Function} Express middleware
 *
 * Usage: router.get('/admin', requireRole(['owner', 'manager']), controllerFunction)
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // User should be attached to req by auth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of these roles: ${allowedRoles.join(', ')}`
      });
    }

    // User has required role, proceed
    next();
  };
};

/**
 * Middleware to check if user has specific permission
 * @param {String} resource - Resource type (e.g., 'products', 'sales')
 * @param {String} action - Action type (e.g., 'create', 'read', 'update', 'delete')
 * @returns {Function} Express middleware
 *
 * Usage: router.post('/products', requirePermission('products', 'create'), createProduct)
 */
export const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const rolePermissions = ROLE_PERMISSIONS[userRole];

    // Check if role exists
    if (!rolePermissions) {
      return res.status(403).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Check if user has permission for this resource and action
    const resourcePermissions = rolePermissions[resource] || [];
    if (!resourcePermissions.includes(action)) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${action} ${resource}`
      });
    }

    // User has required permission, proceed
    next();
  };
};

/**
 * Middleware to check if user owns the resource
 * Useful for allowing users to edit their own profile
 * @param {String} userIdParam - Name of the param containing user ID (default: 'id')
 */
export const requireOwnership = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const resourceUserId = req.params[userIdParam];
    const currentUserId = req.user._id.toString();

    // Owners can access any resource
    if (req.user.role === 'owner') {
      return next();
    }

    // Other users can only access their own resources
    if (resourceUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own resources'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user belongs to the same business
 * Prevents users from accessing data from other businesses
 */
export const requireSameBusiness = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // For now, just proceed. This will be implemented when we add Business model
  // TODO: Implement business-level isolation
  next();
};

/**
 * Helper function to check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of role names
 * @returns {Boolean}
 */
export const hasRole = (user, roles) => {
  return roles.includes(user.role);
};

/**
 * Helper function to check if user has specific permission
 * @param {Object} user - User object
 * @param {String} resource - Resource type
 * @param {String} action - Action type
 * @returns {Boolean}
 */
export const hasPermission = (user, resource, action) => {
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource] || [];
  return resourcePermissions.includes(action);
};
