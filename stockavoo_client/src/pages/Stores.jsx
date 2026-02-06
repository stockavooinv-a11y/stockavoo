import { useState } from 'react';
import { Store as StoreIcon, Plus, MoreVertical, Edit, Trash2, MapPin, Phone, DollarSign } from 'lucide-react';
import { useGetAllStoresQuery, useDeleteStoreMutation } from '../store/api/storeApi';
import RBACGuard from '../components/RBACGuard';
import StoreModal from '../components/StoreModal';
import StoreDetailModal from '../components/StoreDetailModal';
import { Button, SearchInput } from '../components/common';
import { useToast } from '../contexts/ToastContext';

/**
 * STORES LIST PAGE
 *
 * Displays all stores created by the business owner.
 * Unique card-based grid layout for better space efficiency.
 * Only accessible to Store Owners.
 */
const Stores = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  // Get location display
  const getLocationDisplay = (store) => {
    if (store.address?.city && store.address?.state) {
      return `${store.address.city}, ${store.address.state}`;
    }
    return store.address?.city || store.address?.state || 'No location';
  };

  return (
    <>
      {/* Compact Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center">
              <StoreIcon className="w-5 h-5 text-[#2A1142]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Stores</h1>
              <p className="text-xs text-slate-500">{data?.count || 0} locations</p>
            </div>
          </div>
          <RBACGuard resource="stores" action="create">
            <Button onClick={() => setShowStoreModal(true)} variant="primary" className="text-sm">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </RBACGuard>
        </div>

        {/* Compact Search */}
        <div className="mt-3">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores..."
            fullWidth
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7C3E8C] mx-auto"></div>
            <p className="text-slate-600 text-sm mt-3">Loading stores...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-lg flex items-center justify-center">
              <StoreIcon className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600 font-medium text-sm">Error loading stores</p>
            <p className="text-slate-500 text-xs mt-1">{error.message || 'Something went wrong'}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStores.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-lg flex items-center justify-center">
              <StoreIcon className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-sm">
              {searchTerm ? 'No stores found' : 'No stores yet'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {searchTerm ? 'Try a different search term' : 'Create your first store to get started'}
            </p>
          </div>
        )}

        {/* Compact Card Grid */}
        {!isLoading && !error && filteredStores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((store) => (
              <div
                key={store._id}
                onClick={() => {
                  setSelectedStore(store);
                  setShowDetailModal(true);
                }}
                className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:border-[#7C3E8C]/30 hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Actions Menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionMenu(showActionMenu === store._id ? null : store._id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showActionMenu === store._id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-10 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStore(store);
                          setShowStoreModal(true);
                          setShowActionMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-[#7C3E8C]" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStore(store._id);
                          setShowActionMenu(null);
                        }}
                        disabled={isDeleting}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-100 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Store Icon & Name */}
                <div className="flex items-start gap-3 pr-8">
                  <div className="shrink-0 h-10 w-10 rounded-lg border-2 border-slate-200 flex items-center justify-center bg-slate-50">
                    <StoreIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{store.name}</h3>
                    {store.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{store.description}</p>
                    )}
                  </div>
                </div>

                {/* Compact Info Grid */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{store.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{getLocationDisplay(store)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{store.taxRate || 0}% • {store.currency || 'NGN'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Store Detail Modal */}
      <StoreDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
        onEdit={(store) => {
          setSelectedStore(store);
          setShowStoreModal(true);
        }}
      />

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
