//Toast.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { COLORS } from '@/utils/constants';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const typeStyles = {
    success: {
      backgroundColor: COLORS.success,
      icon: '✓',
    },
    error: {
      backgroundColor: COLORS.error,
      icon: '⚠',
    },
    warning: {
      backgroundColor: COLORS.warning,
      icon: '⚠',
    },
    info: {
      backgroundColor: COLORS.info,
      icon: 'ℹ',
    },
  };

  return (
    <div
      className={`toast-item ${isExiting ? 'exiting' : ''}`}
      style={{
        backgroundColor: typeStyles[toast.type].backgroundColor,
      }}
    >
      <div className="toast-content">
        <span className="toast-icon">{typeStyles[toast.type].icon}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
};

// Hook for using toast
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) =>
    showToast(message, 'success', duration);
  const error = (message: string, duration?: number) =>
    showToast(message, 'error', duration);
  const warning = (message: string, duration?: number) =>
    showToast(message, 'warning', duration);
  const info = (message: string, duration?: number) =>
    showToast(message, 'info', duration);

  const ToastComponent = () => (
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  );

  return {
    ToastComponent,
    showToast,
    success,
    error,
    warning,
    info,
  };
};

export default ToastContainer;