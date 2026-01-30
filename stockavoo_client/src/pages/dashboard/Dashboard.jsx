import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import { ConfirmationModal, VerificationBanner } from '../../components/common';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
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

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', current: true },
    { name: 'Products', icon: Package, href: '/products', current: false },
    { name: 'Sales', icon: ShoppingCart, href: '/sales', current: false },
    { name: 'Customers', icon: Users, href: '/customers', current: false },
    { name: 'Reports', icon: FileText, href: '/reports', current: false },
    { name: 'Settings', icon: Settings, href: '/settings', current: false },
  ];

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
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    item.current
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </a>
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
              className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-sm text-slate-600">Welcome back, {user?.fullName?.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Verification Banner */}
        <VerificationBanner />

        {/* Main Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value="0"
              change="+0%"
              trend="up"
              icon={Package}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Low Stock Items"
              value="0"
              change="0%"
              trend="neutral"
              icon={AlertTriangle}
              color="from-amber-500 to-orange-600"
            />
            <StatCard
              title="Total Value"
              value="$0.00"
              change="+0%"
              trend="up"
              icon={DollarSign}
              color="from-emerald-500 to-green-600"
            />
            <StatCard
              title="Sales Today"
              value="0"
              change="0%"
              trend="neutral"
              icon={BarChart3}
              color="from-purple-500 to-purple-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 mb-8 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton icon={Package} label="Add Product" />
              <ActionButton icon={TrendingUp} label="Record Stock In" />
              <ActionButton icon={TrendingDown} label="Record Stock Out" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="font-medium">No recent activity</p>
              <p className="text-sm mt-2">Start by adding products to your inventory</p>
            </div>
          </div>
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
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
  return (
    <div className="group relative bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
          {change}
        </span>
        <span className="text-sm text-slate-500">vs last month</span>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, label }) => {
  return (
    <button className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl hover:border-[#7C3E8C] hover:shadow-lg hover:shadow-[#7C3E8C]/10 transition-all duration-300">
      <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#7C3E8C] transition-colors" />
      <span className="font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
    </button>
  );
};

export default Dashboard;
