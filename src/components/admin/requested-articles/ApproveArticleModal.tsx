"use client";

import React from "react";
import { Check } from "lucide-react";

interface ApproveArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  articleTitle: string;
  isLoading?: boolean;
}

export default function ApproveArticleModal({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
  isLoading = false,
}: ApproveArticleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white">Approve Article</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Are you sure you want to approve <span className="font-semibold text-slate-200">"{articleTitle}"</span>? This will make the article visible on the public news feed immediately.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2 border border-slate-800 hover:bg-slate-900 disabled:opacity-50 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-lg text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Approving...
              </>
            ) : (
              "Yes, Approve"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}