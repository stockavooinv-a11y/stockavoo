import { Store, MapPin, Mail, Phone, Edit } from 'lucide-react';
import { Modal, Button } from './common';

/**
 * STORE DETAIL MODAL
 *
 * Simple and compact store information display.
 */
const StoreDetailModal = ({ isOpen, onClose, store, onEdit }) => {
  if (!store) return null;

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
      subtitle={store.description || 'Store Details'}
      icon={<Store className="w-6 h-6" />}
      size="sm"
    >
      <div className="p-6 space-y-4">
        {/* Contact & Location Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-900">{store.phoneNumber}</span>
          </div>

          {store.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-900">{store.email}</span>
            </div>
          )}

          <div className="flex items-start gap-3 text-sm">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="text-slate-600">{getFullAddress()}</span>
          </div>
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
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StoreDetailModal;
