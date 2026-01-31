import { X } from 'lucide-react';
import { useEffect } from 'react';

/**
 * REUSABLE MODAL COMPONENT
 *
 * Modern glassmorphism modal with blur backdrop.
 * Shows the dashboard content blurred in the background.
 *
 * Props:
 * - isOpen: boolean - Controls modal visibility
 * - onClose: function - Called when modal is closed
 * - title: string - Modal title
 * - subtitle: string (optional) - Modal subtitle/description
 * - icon: ReactNode (optional) - Icon to display in header
 * - children: ReactNode - Modal content
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Modal size (default: 'md')
 * - showCloseButton: boolean - Show X button (default: true)
 * - closeOnOverlayClick: boolean - Close on overlay click (default: true)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      ></div>

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Content with glassmorphism */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="relative px-6 py-5 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  {icon && (
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <div className="text-white">
                        {icon}
                      </div>
                    </div>
                  )}

                  {/* Title & Subtitle */}
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2 className="text-xl font-bold text-slate-900 mb-1">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-sm text-slate-600">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Body - Scrollable */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
            {children}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Modal;
