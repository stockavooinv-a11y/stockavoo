import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome back, {user?.fullName?.split(' ')[0]}</p>
          </div>
        </div>
      </header>

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
    </>
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
    <button className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl hover:border-[#7C3E8C] hover:shadow-lg hover:shadow-[#7C3E8C]/10 transition-all duration-300 cursor-pointer">
      <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#7C3E8C] transition-colors" />
      <span className="font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
    </button>
  );
};

export default Dashboard;
