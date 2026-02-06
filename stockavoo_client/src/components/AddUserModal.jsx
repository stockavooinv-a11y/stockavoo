import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { useCreateUserMutation, useUpdateUserMutation } from '../store/api/userApi';
import { getRoleOptions, ROLE_DESCRIPTIONS } from '../utils/rbac';
import { Modal, Input, Button } from './common';
import { useToast } from '../contexts/ToastContext';

/**
 * ADD/EDIT USER MODAL
 *
 * Modal for creating new users or editing existing ones.
 * Includes role selection and basic user information.
 */
const AddUserModal = ({ isOpen, onClose, user = null }) => {
  const isEditMode = !!user;
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'clerk', // Default role
  });

  const [errors, setErrors] = useState({});

  // RTK Query mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isLoading = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || 'clerk',
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (isEditMode) {
        // Update existing user
        await updateUser({
          id: user._id,
          ...formData,
        }).unwrap();
        toast.success('User updated successfully!');
      } else {
        // Create new user
        await createUser(formData).unwrap();
        toast.success('User invited successfully! They will receive an email with login instructions.');
      }

      onClose();
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || 'An error occurred');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'clerk',
    });
    setErrors({});
  };

  // Close modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit User' : 'Invite New User'}
      subtitle={isEditMode ? 'Update user information and role' : 'Send an invitation to join your team'}
      icon={<UserPlus className="w-6 h-6" />}
      size="md"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="John Doe"
            required
          />

          {/* Email */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@example.com"
            disabled={isEditMode}
            hint={isEditMode ? 'Email cannot be changed' : ''}
            required
          />

          {/* Phone Number */}
          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            placeholder="+1234567890"
            required
          />

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all bg-slate-50/50 focus:bg-white ${
                errors.role
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-slate-200 focus:border-[#7C3E8C] focus:ring-4 focus:ring-[#7C3E8C]/10'
              }`}
            >
              <option value="">Select a role...</option>
              {getRoleOptions().map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.role}
              </p>
            )}

            {/* Role Description */}
            {formData.role && ROLE_DESCRIPTIONS[formData.role] && (
              <div className="mt-3 p-4 bg-gradient-to-r from-[#7C3E8C]/5 to-[#7C3E8C]/10 border-l-4 border-[#7C3E8C] rounded-lg">
                <p className="text-sm text-[#7C3E8C]">
                  <strong className="font-semibold">📋 Permissions:</strong> {ROLE_DESCRIPTIONS[formData.role]}
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          {!isEditMode && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong className="font-semibold">📧 Note:</strong> The user will receive an email with a temporary password and verification link.
                They must verify their email and change their password upon first login.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {!isLoading && <UserPlus className="w-4 h-4" />}
              {isEditMode ? 'Update User' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Modal>
  );
};

export default AddUserModal;
