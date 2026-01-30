import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children, requireVerification = true }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check email verification if required
  if (requireVerification && user && !user.isVerified) {
    // Redirect to verification waiting page if email not verified
    return <Navigate to="/verify-email-waiting" replace />;
  }

  return children;
};

export default ProtectedRoute;
