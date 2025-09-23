import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Auto-hide after 7.7 seconds
    setTimeout(() => setToast(null), 7700);
  };

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
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div 
          className={`toast ${toast.type}`} 
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
              <span style={{
                fontSize: '24px',
                display: 'inline-flex',
                alignItems: 'center',
              }}>
                {toast.type === 'success' ? '✓' : 'ℹ️'}
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

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
