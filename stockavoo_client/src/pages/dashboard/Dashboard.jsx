import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stockavoo</h1>
              {user && (
                <p className="text-sm text-gray-600">Welcome, {user.fullName}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value="0"
            icon="📦"
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Low Stock Items"
            value="0"
            icon="⚠️"
            color="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            title="Total Value"
            value="$0.00"
            icon="💰"
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Categories"
            value="0"
            icon="📊"
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton icon="➕" label="Add Product" />
            <ActionButton icon="📥" label="Record Stock In" />
            <ActionButton icon="📤" label="Record Stock Out" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p>No recent activity</p>
            <p className="text-sm mt-2">Start by adding products to your inventory</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-3xl p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon, label }) => {
  return (
    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default Dashboard;
