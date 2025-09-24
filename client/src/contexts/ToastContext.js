import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} Toast
 * @property {string} message - The message to display
 * @property {'success'|'error'|'info'|'warning'} type - The type of toast
 * @property {number} [duration] - Duration in milliseconds (default: 7700)
 * @property {string} [id] - Unique identifier for the toast
 */

const ToastContext = createContext();

/**
 * ToastProvider component that manages toast notifications
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} [props.defaultDuration=7700] - Default duration for toasts in milliseconds
 */
export const ToastProvider = ({ children, defaultDuration = 7700 }) => {
  const [toast, setToast] = useState(null);
  const toastTimeout = React.useRef();

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {'success'|'error'|'info'|'warning'} [type='success'] - The type of toast
   * @param {Object} [options] - Additional options
   * @param {number} [options.duration] - Duration in milliseconds
   */
  const showToast = useCallback((message, type = 'success', { duration } = {}) => {
    // Clear any existing timeout
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    const toastId = Date.now().toString();
    setToast({ message, type, id: toastId });

    // Auto-hide after specified duration or default
    toastTimeout.current = setTimeout(() => {
      setToast(current => current?.id === toastId ? null : current);
    }, duration || defaultDuration);
  }, [defaultDuration]);

  // Blue theme colors
  const toastStyles = {
    success: {
      background: 'linear-gradient(135deg, #1e88e5, #1976d2)',
      borderLeft: '5px solid #0d47a1',
    },
    error: {
      background: 'linear-gradient(135deg, #e53935, #c62828)',
      borderLeft: '5px solid #b71c1c',
    },
    info: {
      background: 'linear-gradient(135deg, #2196f3, #1976d2)',
      borderLeft: '5px solid #0d47a1',
    },
    warning: {
      background: 'linear-gradient(135deg, #ff9800, #f57c00)',
      borderLeft: '5px solid #e65100',
    }
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div 
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className={`toast toast-${toast.type}`}
          style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '20px 40px',
            borderRadius: '8px',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            minWidth: '400px',
            maxWidth: '90%',
            fontSize: '18px',
            fontWeight: '500',
            ...toastStyles[toast.type] || toastStyles.success,
            animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}>
              <span 
                role="img"
                aria-label={toast.type}
                style={{
                  fontSize: '24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {toast.type === 'success' ? '✓' : 
                 toast.type === 'error' ? '✕' : 
                 toast.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button 
              onClick={() => setToast(null)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '15px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes slideDown {
          from { 
            transform: translate(-50%, -100%); 
            opacity: 0; 
          }
          to { 
            transform: translate(-50%, 0); 
            opacity: 1; 
          }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .toast {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .toast[style*="display: none"] {
          animation: fadeOut 0.3s ease forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultDuration: PropTypes.number,
};

/**
 * Hook to use the toast context
 * @returns {Object} The toast context with showToast function
 * @throws {Error} If used outside of a ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};