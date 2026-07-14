"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface RejectArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  articleTitle: string;
  authorName: string;
  isLoading?: boolean;
}

export default function RejectArticleModal({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
  authorName,
  isLoading = false,
}: RejectArticleModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  // Reset reason when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setRejectionReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3 mb-4">
          <X className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Reject Article Submission</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          You are rejecting <span className="font-semibold text-slate-200">"{articleTitle}"</span> by {authorName}. Please provide a reason to log for the user.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Reason for Rejection
            </label>
            <textarea
              placeholder="e.g. Duplicate submission, lacks credible references, inappropriate language..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              disabled={isLoading}
              className="w-full p-3 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-rose-500/30 focus:border-rose-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all resize-none disabled:opacity-50"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 border border-slate-800 hover:bg-slate-900 disabled:opacity-50 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-rose-600/10 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Rejecting...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}