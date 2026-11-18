import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };

  const bgColors = {
    success: 'bg-slate-900 text-white border-slate-700',
    error: 'bg-rose-950 text-white border-rose-800',
    info: 'bg-slate-900 text-white border-slate-700',
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-subtle pointer-events-none">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${bgColors[toast.type] || bgColors.success} pointer-events-auto`}>
        {icons[toast.type] || icons.success}
        <div className="text-xs sm:text-sm font-medium leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
}
