import React, { useEffect } from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';

interface NotificationProps {
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
  onClose: () => void;
}

const NotificationSystem: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'success-message';
      case 'error':
        return 'bg-red-600';
      case 'info':
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 ${getNotificationStyles()} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-md animate-slide-in`}
    >
      {getIcon()}
      <span className="flex-1">{notification.message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NotificationSystem;
