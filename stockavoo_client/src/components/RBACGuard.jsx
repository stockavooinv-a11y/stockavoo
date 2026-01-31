import { useSelector } from 'react-redux';
import { hasRole, hasPermission, canAccessFeature } from '../utils/rbac';

/**
 * RBAC GUARD COMPONENT
 *
 * Conditionally renders children based on user roles and permissions.
 * Provides flexible access control for UI elements.
 *
 * Usage Examples:
 *
 * 1. Role-based rendering:
 *    <RBACGuard roles={['owner', 'manager']}>
 *      <AdminPanel />
 *    </RBACGuard>
 *
 * 2. Permission-based rendering:
 *    <RBACGuard resource="products" action="create">
 *      <AddProductButton />
 *    </RBACGuard>
 *
 * 3. Feature-based rendering:
 *    <RBACGuard feature="userManagement">
 *      <UserManagementPage />
 *    </RBACGuard>
 *
 * 4. Custom fallback:
 *    <RBACGuard roles={['owner']} fallback={<AccessDenied />}>
 *      <OwnerOnlyContent />
 *    </RBACGuard>
 */
const RBACGuard = ({
  children,
  roles,
  resource,
  action,
  feature,
  fallback = null,
  requireAll = false, // If true, user must pass ALL checks (AND logic)
}) => {
  const user = useSelector((state) => state.auth.user);

  // If no user is logged in, deny access
  if (!user) {
    return fallback;
  }

  const checks = [];

  // Check roles
  if (roles) {
    checks.push(hasRole(user, roles));
  }

  // Check permissions
  if (resource && action) {
    checks.push(hasPermission(user, resource, action));
  }

  // Check feature access
  if (feature) {
    checks.push(canAccessFeature(user, feature));
  }

  // If no checks specified, allow access (default behavior)
  if (checks.length === 0) {
    return children;
  }

  // Determine if user has access
  const hasAccess = requireAll
    ? checks.every((check) => check === true) // AND logic - all checks must pass
    : checks.some((check) => check === true); // OR logic - at least one check must pass

  return hasAccess ? children : fallback;
};

export default RBACGuard;
