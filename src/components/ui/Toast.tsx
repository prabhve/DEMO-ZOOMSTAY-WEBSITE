import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast || toast.type === 'loading') return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-900/90 text-white border-emerald-700/50 shadow-emerald-950/20',
    error: 'bg-red-950/90 text-white border-red-800/50 shadow-red-950/20',
    info: 'bg-[#1E2229]/95 text-[#FAF8F5] border-[#8C7355]/40 shadow-black/25',
    loading: 'bg-[#1E2229]/95 text-[#FAF8F5] border-[#8C7355]/40 shadow-black/25',
  }[toast.type];

  const icon = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-[#C5B49E] shrink-0 mt-0.5" />,
    loading: <Loader2 className="w-5 h-5 text-[#C5B49E] animate-spin shrink-0 mt-0.5" />,
  }[toast.type];

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all ${bgStyles}`}
      >
        {icon}
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-xs font-bold uppercase tracking-wider font-sans">
            {toast.title}
          </div>
          {toast.description && (
            <div className="text-xs text-stone-200/90 mt-0.5 leading-relaxed font-sans">
              {toast.description}
            </div>
          )}
        </div>
        {toast.type !== 'loading' && (
          <button
            onClick={onClose}
            className="p-1 -mr-1 -mt-1 text-stone-400 hover:text-white rounded-lg transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
