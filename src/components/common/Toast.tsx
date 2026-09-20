import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onClose, onDismiss }) => {
  const dismiss = onClose || onDismiss || (() => {});

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarn = toast.type === 'warning';
        const isError = toast.type === 'error';

        const borderClass = isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
          : isWarn
          ? 'border-amber-200 bg-amber-50 text-amber-950'
          : isError
          ? 'border-rose-200 bg-rose-50 text-rose-950'
          : 'border-blue-200 bg-blue-50 text-blue-950';

        const Icon = isSuccess
          ? CheckCircle2
          : isWarn
          ? AlertTriangle
          : isError
          ? AlertCircle
          : Info;

        const iconColor = isSuccess
          ? 'text-emerald-600'
          : isWarn
          ? 'text-amber-600'
          : isError
          ? 'text-rose-600'
          : 'text-blue-600';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-xs animate-in slide-in-from-bottom-2 duration-200 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const Toast = ToastContainer;
