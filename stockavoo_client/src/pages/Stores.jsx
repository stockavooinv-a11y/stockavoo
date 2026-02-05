import { useState } from 'react';
import { Store as StoreIcon, Plus, Search, MoreVertical, Edit, Trash2, MapPin } from 'lucide-react';
import { useGetAllStoresQuery, useDeleteStoreMutation } from '../store/api/storeApi';
import RBACGuard from '../components/RBACGuard';
import StoreModal from '../components/StoreModal';
import { Button, Table } from '../components/common';
import { useToast } from '../contexts/ToastContext';

/**
 * STORES LIST PAGE
 *
 * Displays all stores created by the business owner.
 * Only accessible to Store Owners.
 */
const Stores = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Fetch all stores
  const { data, isLoading, error } = useGetAllStoresQuery();
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  // Filter stores based on search
  const filteredStores = data?.data?.filter((store) => {
    const search = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(search) ||
      store.phoneNumber.includes(search) ||
      store.email?.toLowerCase().includes(search) ||
      store.address?.city?.toLowerCase().includes(search)
    );
  }) || [];

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('Are you sure you want to deactivate this store?')) {
      try {
        await deleteStore(storeId).unwrap();
        toast.success('Store deactivated successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to deactivate store');
      }
    }
  };

  // Table column definitions
  const columns = [
    {
      key: 'store',
      label: 'Store Name',
      render: (store) => (
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-semibold text-sm">
                {store.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{store.name}</div>
            {store.description && (
              <div className="text-xs text-slate-500 truncate max-w-xs">{store.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (store) => (
        <div>
          <div className="text-sm text-slate-900">{store.phoneNumber}</div>
          {store.email && <div className="text-xs text-slate-500">{store.email}</div>}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (store) => (
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="text-sm text-slate-600">
            {store.address?.city && store.address?.state ? (
              <div>
                {store.address.city}, {store.address.state}
              </div>
            ) : store.address?.city ? (
              store.address.city
            ) : store.address?.state ? (
              store.address.state
            ) : (
              <span className="text-slate-400">No location set</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'taxRate',
      label: 'Tax Rate',
      render: (store) => (
        <div className="text-sm text-slate-600">{store.taxRate || 0}%</div>
      ),
    },
    {
      key: 'currency',
      label: 'Currency',
      render: (store) => (
        <span className="px-3 py-1.5 inline-flex text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          {store.currency || 'NGN'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (store) => (
        <div className="text-sm text-slate-500 font-medium">
          {new Date(store.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (store) => (
        <div className="relative inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(showActionMenu === store._id ? null : store._id);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showActionMenu === store._id && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border-2 border-slate-200 z-10 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStore(store);
                  setShowStoreModal(true);
                  setShowActionMenu(null);
                }}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
              >
                <Edit className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Edit Store</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStore(store._id);
                  setShowActionMenu(null);
                }}
                disabled={isDeleting}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed transition-colors border-t border-slate-100"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Deactivate</span>
              </button>
            </div>
          )}
        </div>
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
                <StoreIcon className="w-7 h-7 text-blue-600" />
                Store Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">Manage your store locations and settings</p>
            </div>

            {/* Add Store Button - Only for Owners */}
            <RBACGuard resource="stores" action="create">
              <Button
                onClick={() => setShowStoreModal(true)}
                variant="primary"
              >
                <Plus className="w-5 h-5" />
                Add Store
              </Button>
            </RBACGuard>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stores Table */}
        <Table
          columns={columns}
          data={filteredStores.map((store) => ({ ...store, id: store._id }))}
          isLoading={isLoading}
          error={error}
          emptyMessage={searchTerm ? 'No stores found matching your search' : 'No stores yet. Create your first store to get started!'}
          emptyIcon={StoreIcon}
          exportable={true}
          exportFilename="stores"
        />

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Total Stores</p>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <StoreIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{data?.count || 0}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">Active Stores</p>
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <StoreIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {data?.data?.filter((s) => s.isActive).length || 0}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <StoreIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {data?.data?.filter((s) => {
                const created = new Date(s.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length || 0}
            </p>
          </div>
        </div>
      </main>

      {/* Unified Store Modal (Single & Bulk) */}
      <StoreModal
        isOpen={showStoreModal}
        onClose={() => {
          setShowStoreModal(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
      />
    </>
  );
};

export default Stores;
