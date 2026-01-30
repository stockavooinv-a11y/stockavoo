import { Button } from './';
import { X } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  icon = null,
}) => {
  if (!isOpen) return null;

  // Determine icon background color based on variant
  const iconBgColor = confirmVariant === 'danger'
    ? 'bg-gradient-to-br from-red-500 to-red-600'
    : 'bg-gradient-to-br from-[#7C3E8C] to-[#5B2C7A]';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-all duration-300 cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-900/10 max-w-md w-full p-8 transform transition-all animate-in zoom-in-95 duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          {icon && (
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${iconBgColor} shadow-lg mb-6 text-white`}>
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-slate-600 text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              fullWidth
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
