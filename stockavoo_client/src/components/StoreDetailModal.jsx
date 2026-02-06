import { Store, MapPin, Mail, Phone, Calendar, DollarSign, Building2, Edit } from 'lucide-react';
import { Modal, Button } from './common';

/**
 * STORE DETAIL MODAL
 *
 * Displays full store information in a read-only modal.
 * Provides edit button to switch to edit mode.
 */
const StoreDetailModal = ({ isOpen, onClose, store, onEdit }) => {
  if (!store) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFullAddress = () => {
    const parts = [
      store.address?.street,
      store.address?.city,
      store.address?.state,
      store.address?.country,
      store.address?.postalCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={store.name}
      subtitle="Store Details"
      icon={<Store className="w-6 h-6" />}
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Store Avatar */}
        <div className="flex items-center justify-center pb-4 border-b border-slate-200">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <span className="text-white font-bold text-3xl">
              {store.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#7C3E8C]" />
            Contact Information
          </h3>
          <div className="space-y-3 bg-slate-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Phone Number</div>
                <div className="text-sm text-slate-900 font-medium">{store.phoneNumber}</div>
              </div>
            </div>
            {store.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">Email</div>
                  <div className="text-sm text-slate-900 font-medium">{store.email}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7C3E8C]" />
            Location
          </h3>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Address</div>
                <div className="text-sm text-slate-900">{getFullAddress()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#7C3E8C]" />
            Business Settings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">Tax Rate</div>
                  <div className="text-sm text-slate-900 font-medium">{store.taxRate || 0}%</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1">Currency</div>
                  <div className="text-sm text-slate-900 font-medium">{store.currency || 'NGN'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Description</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">{store.description}</p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            Created on {formatDate(store.createdAt)}
          </div>
          {store.updatedAt && store.updatedAt !== store.createdAt && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Calendar className="w-3 h-3" />
              Last updated on {formatDate(store.updatedAt)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" onClick={onClose} variant="secondary">
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              onEdit(store);
            }}
            variant="primary"
          >
            <Edit className="w-4 h-4" />
            Edit Store
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StoreDetailModal;
