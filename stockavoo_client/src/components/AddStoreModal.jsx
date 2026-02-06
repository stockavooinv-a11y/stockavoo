import { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import { useCreateStoreMutation, useUpdateStoreMutation } from '../store/api/storeApi';
import { Modal, Input, Button } from './common';
import { useToast } from '../contexts/ToastContext';

/**
 * ADD/EDIT STORE MODAL
 *
 * Modal for creating new stores or editing existing ones.
 * Includes store details, location, and tax settings.
 */
const AddStoreModal = ({ isOpen, onClose, store = null }) => {
  const isEditMode = !!store;
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    description: '',
    taxRate: 0,
    currency: 'NGN',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: '',
    },
  });

  const [errors, setErrors] = useState({});

  // RTK Query mutations
  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();

  const isLoading = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        email: store.email || '',
        phoneNumber: store.phoneNumber || '',
        description: store.description || '',
        taxRate: store.taxRate || 0,
        currency: store.currency || 'NGN',
        address: {
          street: store.address?.street || '',
          city: store.address?.city || '',
          state: store.address?.state || '',
          country: store.address?.country || 'Nigeria',
          postalCode: store.address?.postalCode || '',
        },
      });
    }
  }, [store]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.taxRate < 0 || formData.taxRate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100';
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
        // Update existing store
        await updateStore({
          id: store._id,
          ...formData,
        }).unwrap();
        toast.success('Store updated successfully!');
      } else {
        // Create new store
        await createStore(formData).unwrap();
        toast.success('Store created successfully!');
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
      name: '',
      email: '',
      phoneNumber: '',
      description: '',
      taxRate: 0,
      currency: 'NGN',
      address: {
        street: '',
        city: '',
        state: '',
        country: 'Nigeria',
        postalCode: '',
      },
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
      title={isEditMode ? 'Edit Store' : 'Add New Store'}
      subtitle={isEditMode ? 'Update store information and settings' : 'Create a new store location'}
      icon={<Store className="w-6 h-6" />}
      size="lg"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Store Name */}
            <Input
              label="Store Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Main Branch"
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
              placeholder="+234 XXX XXX XXXX"
              required
            />
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="store@example.com"
            hint="Optional"
          />

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all bg-slate-50/50 focus:bg-white focus:border-[#7C3E8C] focus:ring-4 focus:ring-[#7C3E8C]/10 resize-none"
              placeholder="Brief description of this store location..."
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Location</h3>

          {/* Street Address */}
          <Input
            label="Street Address"
            name="address.street"
            type="text"
            value={formData.address.street}
            onChange={handleChange}
            placeholder="123 Main Street"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <Input
              label="City"
              name="address.city"
              type="text"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="Lagos"
            />

            {/* State */}
            <Input
              label="State/Province"
              name="address.state"
              type="text"
              value={formData.address.state}
              onChange={handleChange}
              placeholder="Lagos"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country */}
            <Input
              label="Country"
              name="address.country"
              type="text"
              value={formData.address.country}
              onChange={handleChange}
              placeholder="Nigeria"
            />

            {/* Postal Code */}
            <Input
              label="Postal Code"
              name="address.postalCode"
              type="text"
              value={formData.address.postalCode}
              onChange={handleChange}
              placeholder="100001"
            />
          </div>
        </div>

        {/* Business Settings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Business Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tax Rate */}
            <Input
              label="Tax Rate (%)"
              name="taxRate"
              type="number"
              value={formData.taxRate}
              onChange={handleChange}
              error={errors.taxRate}
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
            />

            {/* Currency */}
            <div>
              <label htmlFor="currency" className="block text-sm font-semibold text-slate-700 mb-2">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all bg-slate-50/50 focus:bg-white focus:border-[#7C3E8C] focus:ring-4 focus:ring-[#7C3E8C]/10 cursor-pointer"
              >
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>

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
            {!isLoading && <Store className="w-4 h-4" />}
            {isEditMode ? 'Update Store' : 'Create Store'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStoreModal;
