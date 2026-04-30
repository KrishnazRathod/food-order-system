import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className="animate-fade-in"
            style={{
              background: toast.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              boxShadow: 'var(--shadow-premium)',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {toast.type === 'success' ? '✓' : '✕'} {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
