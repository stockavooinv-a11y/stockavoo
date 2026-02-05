import { useState } from 'react';
import { Users as UsersIcon, UserPlus, Search, MoreVertical, Edit, Trash2, AlertCircle, Filter } from 'lucide-react';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../store/api/userApi';
import { getRoleLabel, getRoleColor } from '../utils/rbac';
import RBACGuard from '../components/RBACGuard';
import AddUserModal from '../components/AddUserModal';
import { Button, Table } from '../components/common';
import { useToast } from '../contexts/ToastContext';

/**
 * USERS LIST PAGE
 *
 * Displays all users in the business with role-based access control.
 * Only accessible to Store Owners and Managers.
 */
const Users = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch all users
  const { data, isLoading, error } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Filter users based on search, role, and status
  const filteredUsers = data?.data?.filter((user) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      getRoleLabel(user.role).toLowerCase().includes(search);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && user.isVerified) ||
      (statusFilter === 'pending' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deactivated successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to deactivate user');
      }
    }
  };

  // Table column definitions
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-semibold text-sm">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{user.fullName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (user) => <div className="text-sm text-slate-600">{user.email}</div>,
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      render: (user) => <div className="text-sm text-slate-600">{user.phoneNumber}</div>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => (
        <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-lg ${getRoleColor(user.role)}`}>
          {getRoleLabel(user.role)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-lg ${
          user.isVerified
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'bg-amber-100 text-amber-700 border border-amber-200'
        }`}>
          {user.isVerified ? '✓ Verified' : '⏳ Pending'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (user) => (
        <div className="text-sm text-slate-500 font-medium">
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (user) => (
        <RBACGuard resource="users" action="update">
          <div className="relative inline-block">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(showActionMenu === user._id ? null : user._id);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showActionMenu === user._id && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border-2 border-slate-200 z-10 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(user);
                    setShowAddUserModal(true);
                    setShowActionMenu(null);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Edit User</span>
                </button>
                <RBACGuard resource="users" action="delete">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user._id);
                      setShowActionMenu(null);
                    }}
                    disabled={isDeleting}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed transition-colors border-t border-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Deactivate</span>
                  </button>
                </RBACGuard>
              </div>
            )}
          </div>
        </RBACGuard>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <UsersIcon className="w-7 h-7 text-purple-600" />
                User Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">Manage team members and their roles</p>
            </div>

            {/* Add User Button - Only for Owners */}
            <RBACGuard resource="users" action="create">
              <Button
                onClick={() => setShowAddUserModal(true)}
                variant="primary"
              >
                <UserPlus className="w-5 h-5" />
                Invite User
              </Button>
            </RBACGuard>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="manager">Manager</option>
                <option value="clerk">Clerk</option>
                <option value="accountant">Accountant</option>
                <option value="warehouse_manager">Warehouse Manager</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">

        {/* Users Table */}
        <Table
          columns={columns}
          data={filteredUsers.map((user) => ({ ...user, id: user._id }))}
          isLoading={isLoading}
          error={error}
          emptyMessage={searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'No users found matching your filters' : 'No users yet. Invite your first team member to get started!'}
          emptyIcon={UsersIcon}
          selectable={true}
          onSelectionChange={setSelectedRows}
          exportable={true}
          exportFilename="users"
        />

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{data?.count || 0}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Active Users</p>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {data?.data?.filter((u) => u.isActive).length || 0}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Pending Verification</p>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {data?.data?.filter((u) => !u.isVerified).length || 0}
            </p>
          </div>
        </div>
      </main>

      {/* Add/Edit User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => {
          setShowAddUserModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
};

export default Users;
