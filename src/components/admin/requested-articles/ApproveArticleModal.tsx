"use client";

import React from "react";
import { Check } from "lucide-react";

interface ApproveArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  articleTitle: string;
}

export default function ApproveArticleModal({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
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
            className="flex-1 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold text-white transition-all"
          >
            Yes, Approve
          </button>
        </div>
      </div>
    </div>
  );
}