import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import { ConfirmationModal, VerificationBanner } from '../common';
import { hasRole } from '../../utils/rbac';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

/**
 * DASHBOARD LAYOUT
 *
 * Shared layout for all authenticated pages.
 * Includes sidebar navigation, header, and logout functionality.
 */
const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  // Navigation items with RBAC
  const allNavigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: null },
    { name: 'Products', icon: Package, href: '/products', roles: null },
    { name: 'Sales', icon: ShoppingCart, href: '/sales', roles: null },
    { name: 'Users', icon: Users, href: '/users', roles: ['owner', 'manager'] },
    { name: 'Reports', icon: FileText, href: '/reports', roles: null },
    { name: 'Settings', icon: Settings, href: '/settings', roles: ['owner'] },
  ];

  // Filter navigation based on user role
  const navigation = allNavigation.filter(item =>
    !item.roles || hasRole(user, item.roles)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#2A1142] via-[#4A1D66] to-[#2A1142] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#2A1142]" />
              </div>
              <span className="text-xl font-bold text-white">Stockavoo</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center text-[#2A1142] font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#2A1142]" />
                </div>
                <span className="text-lg font-bold text-slate-900">Stockavoo</span>
              </div>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>
        </header>

        {/* Verification Banner */}
        <VerificationBanner />

        {/* Main Content Area */}
        <main>
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        icon={<LogOut className="w-8 h-8" />}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
