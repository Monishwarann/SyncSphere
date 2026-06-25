import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      glow: 'shadow-emerald-500/10',
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
      icon: <XCircle className="w-5 h-5 text-rose-400" />,
      glow: 'shadow-rose-500/10',
    },
    info: {
      bg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
      icon: <Info className="w-5 h-5 text-indigo-400" />,
      glow: 'shadow-indigo-500/10',
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl glass-card shadow-2xl ${config.bg} ${config.glow} transition-all duration-300 transform translate-y-0 animate-fade-in-up`}>
      {config.icon}
      <span className="text-sm font-medium pr-2">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-md transition-colors"
        aria-label="Close alert"
      >
        <X className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
};

export default Toast;
