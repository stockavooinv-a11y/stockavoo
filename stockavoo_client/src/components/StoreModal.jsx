import { useState, useEffect } from 'react';
import { Store, Upload, Download, FileText, AlertCircle, CheckCircle, MapPin, Building2 } from 'lucide-react';
import {
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useBulkCreateStoresMutation,
} from '../store/api/storeApi';
import { Modal, Button } from './common';
import { useToast } from '../contexts/ToastContext';

/**
 * UNIFIED STORE MODAL
 *
 * Single modal with tabs for:
 * - Single store creation/editing
 * - Bulk store upload via CSV
 */
const StoreModal = ({ isOpen, onClose, store = null }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('single');

  // Single store state
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

  // Bulk upload state
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);

  // API mutations
  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const [updateStore, { isLoading: isUpdating }] = useUpdateStoreMutation();
  const [bulkCreate, { isLoading: isBulkLoading }] = useBulkCreateStoresMutation();

  const isEditMode = !!store;
  const isSingleLoading = isCreating || isUpdating;

  // CSV template
  const csvTemplate = `name,phoneNumber,email,description,taxRate,currency,street,city,state,country,postalCode
Main Branch,+234 XXX XXX XXXX,main@example.com,Our primary store location,7.5,NGN,123 Main Street,Lagos,Lagos,Nigeria,100001
Downtown Store,+234 XXX XXX XXXX,downtown@example.com,City center location,7.5,NGN,456 Market Road,Abuja,FCT,Nigeria,900001
Westside Branch,+234 XXX XXX XXXX,westside@example.com,West area store,7.5,NGN,789 West Avenue,Port Harcourt,Rivers,Nigeria,500001`;

  // Load store data for editing
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
      setActiveTab('single');
    }
  }, [store]);

  // Reset form on modal open/close
  useEffect(() => {
    if (!isOpen) {
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
      setFile(null);
      setParsedData([]);
      setUploadResult(null);
      setActiveTab('single');
    }
  }, [isOpen]);

  // Handle single store form change
  const handleChange = (e) => {
    const { name, value } = e.target;
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
        [name]: name === 'taxRate' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  // Handle single store submit
  const handleSingleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode) {
        await updateStore({ id: store._id, ...formData }).unwrap();
        toast.success('Store updated successfully');
      } else {
        await createStore(formData).unwrap();
        toast.success('Store created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save store');
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stores_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row');
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const stores = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const store = {};

      headers.forEach((header, index) => {
        store[header] = values[index] || '';
      });

      // Convert taxRate to number
      if (store.taxRate) {
        store.taxRate = parseFloat(store.taxRate);
      }

      stores.push(store);
    }

    return stores;
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);

    // Read and parse file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const stores = parseCSV(event.target.result);
        setParsedData(stores);
        toast.success(`Parsed ${stores.length} store(s) from CSV`);
      } catch (error) {
        toast.error(`Error parsing CSV: ${error.message}`);
        setFile(null);
        setParsedData([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  // Handle bulk upload
  const handleBulkUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('No data to upload');
      return;
    }

    try {
      const result = await bulkCreate(parsedData).unwrap();
      setUploadResult(result.data);

      if (result.data.failed.length === 0) {
        toast.success(`Successfully created ${result.data.successful.length} store(s)!`);
      } else {
        toast.warning(
          `Created ${result.data.successful.length} store(s). ${result.data.failed.length} failed.`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upload stores');
    }
  };

  // Tab component
  const Tab = ({ id, label, icon: Icon }) => (
    <button
      type="button"
      onClick={() => {
        if (!isEditMode) setActiveTab(id);
      }}
      disabled={isEditMode}
      className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-lg transition-all ${
        activeTab === id
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
          : isEditMode
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Store' : 'Add Store'}
      subtitle={isEditMode ? 'Update store information' : 'Create new store or upload multiple stores'}
      icon={<Store className="w-6 h-6" />}
      size="lg"
    >
      <div className="p-6">
        {/* Tabs */}
        {!isEditMode && (
          <div className="flex items-center gap-3 mb-6">
            <Tab id="single" label="Single Store" icon={Building2} />
            <Tab id="bulk" label="Bulk Upload" icon={Upload} />
          </div>
        )}

        {/* Single Store Form */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Main Branch"
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+234 XXX XXX XXXX"
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="store@example.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of this store location"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                Location
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="Lagos"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="Lagos"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="Nigeria"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      placeholder="100001"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Settings */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Business Settings</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button type="button" onClick={onClose} variant="secondary" disabled={isSingleLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSingleLoading}
                isLoading={isSingleLoading}
              >
                {isEditMode ? 'Update Store' : 'Create Store'}
              </Button>
            </div>
          </form>
        )}

        {/* Bulk Upload Tab */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">How to upload stores</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Download the CSV template below</li>
                    <li>Fill in your store information in the template</li>
                    <li>Upload the completed CSV file</li>
                    <li>Review and confirm the upload</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Download Template */}
            <div>
              <Button onClick={downloadTemplate} variant="outline" className="w-full">
                <Download className="w-4 h-4" />
                Download CSV Template
              </Button>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload CSV File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100
                    cursor-pointer"
                />
              </div>
              {file && (
                <p className="mt-2 text-sm text-slate-600">
                  Selected: {file.name} ({parsedData.length} stores)
                </p>
              )}
            </div>

            {/* Preview */}
            {parsedData.length > 0 && !uploadResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Preview</h4>
                <div className="max-h-48 overflow-y-auto">
                  <ul className="text-sm text-slate-600 space-y-1">
                    {parsedData.slice(0, 5).map((store, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        {store.name} - {store.phoneNumber}
                      </li>
                    ))}
                    {parsedData.length > 5 && (
                      <li className="text-slate-500 italic">
                        ... and {parsedData.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Upload Result */}
            {uploadResult && (
              <div className="space-y-3">
                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Upload Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {uploadResult.summary.total}
                      </div>
                      <div className="text-xs text-slate-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {uploadResult.summary.successful}
                      </div>
                      <div className="text-xs text-slate-600">Successful</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {uploadResult.summary.failed}
                      </div>
                      <div className="text-xs text-slate-600">Failed</div>
                    </div>
                  </div>
                </div>

                {/* Failed Items */}
                {uploadResult.failed.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-2">
                          Failed Items ({uploadResult.failed.length})
                        </h4>
                        <div className="max-h-32 overflow-y-auto">
                          <ul className="text-sm text-red-800 space-y-1">
                            {uploadResult.failed.map((item, index) => (
                              <li key={index}>
                                Row {item.row}: {item.error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isBulkLoading}
              >
                {uploadResult ? 'Close' : 'Cancel'}
              </Button>
              {!uploadResult && (
                <Button
                  onClick={handleBulkUpload}
                  variant="primary"
                  disabled={isBulkLoading || parsedData.length === 0}
                  isLoading={isBulkLoading}
                >
                  {!isBulkLoading && <Upload className="w-4 h-4" />}
                  Upload {parsedData.length} Store(s)
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StoreModal;
