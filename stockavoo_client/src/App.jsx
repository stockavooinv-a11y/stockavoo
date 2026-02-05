import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SetupAccount from './pages/auth/SetupAccount';
import VerifyEmail from './pages/auth/VerifyEmail';
import VerificationWaiting from './pages/auth/VerificationWaiting';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/Users';
import Stores from './pages/Stores';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RBACGuard from './components/RBACGuard';
import DashboardLayout from './components/layouts/DashboardLayout';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/setup-account/:token" element={<SetupAccount />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route
        path="/verify-email-waiting"
        element={
          <ProtectedRoute requireVerification={false}>
            <VerificationWaiting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RBACGuard roles={['owner']}>
                <Stores />
              </RBACGuard>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RBACGuard roles={['owner', 'manager']}>
                <Users />
              </RBACGuard>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Add more routes as we build them */}
    </Routes>
  );
}

export default App;
