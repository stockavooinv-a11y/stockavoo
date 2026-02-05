import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, Shield, Calendar, Edit2, Camera, Lock, CheckCircle, Clock } from 'lucide-react';
import { useGetCurrentUserQuery, useUpdateOwnProfileMutation, useChangePasswordMutation } from '../store/api/userApi';
import { Button, Modal, Input } from '../components/common';
import { useToast } from '../contexts/ToastContext';
import { getRoleLabel } from '../utils/rbac';

/**
 * USER PROFILE PAGE
 *
 * Displays user profile information with edit capabilities.
 * Users can update their name, phone, and profile picture.
 */
const Profile = () => {
  const toast = useToast();
  const { user: authUser } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateOwnProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const user = data?.data || authUser;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleEditClick = () => {
    setFormData({
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors for this field
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    // Client-side validation
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success('Password changed successfully');
      setShowChangePasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
              <p className="text-slate-600 mt-1">Manage your personal information and settings</p>
            </div>
            <Button onClick={handleEditClick} variant="primary">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-slate-600 font-bold text-3xl">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors cursor-pointer">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold mb-1 truncate text-slate-900">{user?.fullName}</h2>
                  <p className="text-slate-600 text-sm truncate">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user?.isVerified ? (
                      <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                    <span className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      {getRoleLabel(user?.role)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{user?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details Card */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold mb-4 text-slate-900">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">Role</span>
                    <span className="text-sm font-semibold text-slate-900">{getRoleLabel(user?.role)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">Status</span>
                    <span className={`text-sm font-semibold ${user?.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <span className="text-sm text-slate-600">Last Login</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/20">
                    <Lock className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">Security Settings</h3>
                  <p className="text-purple-200 text-sm mb-4">
                    Keep your account secure by updating your password regularly
                  </p>
                  <Button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 px-4 py-2"
                    variant="outline"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="+1234567890"
          />

          <div className="flex items-center gap-3 justify-end pt-4">
            <Button
              type="button"
              onClick={() => setShowEditModal(false)}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setPasswordErrors({});
        }}
        title="Change Password"
        size="sm"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-5 p-6">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.currentPassword}
            placeholder="Enter current password"
            autoComplete="current-password"
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.newPassword}
            hint="Must be at least 8 characters"
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={passwordErrors.confirmPassword}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />

          <div className="flex items-center gap-3 justify-end pt-4">
            <Button
              type="button"
              onClick={() => {
                setShowChangePasswordModal(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                setPasswordErrors({});
              }}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isChangingPassword}>
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Profile;
