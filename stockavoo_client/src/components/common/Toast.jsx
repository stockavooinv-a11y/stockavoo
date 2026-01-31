import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * TOAST NOTIFICATION COMPONENT
 *
 * Modern toast notifications with glassmorphism design.
 *
 * Props:
 * - message: string - The message to display
 * - type: 'success' | 'error' | 'warning' | 'info' - Toast type
 * - onClose: function - Called when toast is dismissed
 * - duration: number - Auto-dismiss duration in ms (default: 5000)
 * - position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' - Toast position
 */
const Toast = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
  position = 'top-right'
}) => {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Toast configurations - Modern glassmorphism style
  const config = {
    success: {
      icon: CheckCircle,
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      borderColor: 'border-emerald-200',
      accentColor: 'bg-emerald-500'
    },
    error: {
      icon: XCircle,
      iconBg: 'bg-red-500',
      iconColor: 'text-white',
      borderColor: 'border-red-200',
      accentColor: 'bg-red-500'
    },
    warning: {
      icon: AlertCircle,
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      borderColor: 'border-amber-200',
      accentColor: 'bg-amber-500'
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      borderColor: 'border-blue-200',
      accentColor: 'bg-blue-500'
    }
  };

  const { icon: Icon, iconBg, iconColor, borderColor, accentColor } = config[type];

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 animate-slide-in-right`}
      role="alert"
    >
      <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 ${borderColor} overflow-hidden min-w-[360px] max-w-md`}>
        <div className="flex items-start gap-4 p-4">
          {/* Icon with gradient background */}
          <div className="flex-shrink-0">
            <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 pt-1.5">
            <p className="text-sm font-medium text-slate-800 leading-relaxed">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-1 bg-slate-100">
            <div
              className={`h-full ${accentColor} animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
