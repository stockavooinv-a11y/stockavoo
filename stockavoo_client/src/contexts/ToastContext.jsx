import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

/**
 * TOAST CONTEXT
 *
 * Global toast notification system for the application.
 * Provides a simple API to show success, error, warning, and info messages.
 *
 * Usage:
 * const toast = useToast();
 * toast.success('User created successfully!');
 * toast.error('Failed to save changes');
 * toast.warning('Please verify your email');
 * toast.info('New features available');
 */

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Helper methods
  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Render toasts */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{ marginTop: index > 0 ? '12px' : '0' }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
