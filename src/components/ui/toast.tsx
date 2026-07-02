"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const styles = {
    success: "border-emerald-500/20 bg-slate-900/90 backdrop-blur-md text-emerald-100 shadow-emerald-950/20",
    error: "border-rose-500/20 bg-slate-900/90 backdrop-blur-md text-rose-100 shadow-rose-950/20",
    info: "border-sky-500/20 bg-slate-900/90 backdrop-blur-md text-sky-100 shadow-sky-950/20",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 scale-100 animate-in fade-in slide-in-from-top-4 duration-300 ${styles[toast.type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-slate-800/80 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
