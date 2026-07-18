"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";

interface EditTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  currentName: string;
  isLoading?: boolean;
}

export default function EditTagModal({
  isOpen,
  onClose,
  onConfirm,
  currentName,
  isLoading = false,
}: EditTagModalProps) {
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTagName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagName.trim()) {
      onConfirm(tagName.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Edit Tag</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Tag Name
            </label>
            <input
              type="text"
              placeholder="e.g. Barcelona, Injury Update, Messi..."
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 border border-slate-800 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}