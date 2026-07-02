"use client";

import React, { useState, useEffect } from "react";
import { X, FolderPlus } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onConfirm,
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCategoryName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onConfirm(categoryName.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <FolderPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Add New Category</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Volleyball, Cricket, Swimming..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}