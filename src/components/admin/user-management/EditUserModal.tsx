"use client";

import React, { useState, useEffect } from "react";
import { X, Edit2 } from "lucide-react";
import { User } from "@/redux/features/users/users.type";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    role: "reader" | "author" | "editor" | "admin";
    bio: string;
    is_active: boolean;
    is_email_verified: boolean;
  }) => void;
  currentUser: User | null;
  isLoading?: boolean;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onConfirm,
  currentUser,
  isLoading = false,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"reader" | "author" | "editor" | "admin">("reader");
  const [bio, setBio] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || "");
      setRole(currentUser.role || "reader");
      setBio(currentUser.bio || "");
      setIsActive(currentUser.is_active);
      setIsEmailVerified(currentUser.is_email_verified);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      name: name.trim(),
      role,
      bio: bio.trim(),
      is_active: isActive,
      is_email_verified: isEmailVerified,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <Edit2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Edit User Profile</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-lg text-xs text-slate-200 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="reader">Reader</option>
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Biography
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder="A brief bio..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-lg text-xs text-slate-200 placeholder-slate-600 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Account Status
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-650 focus:ring-indigo-500/30"
                />
                <label htmlFor="isActive" className="text-xs text-slate-300 select-none">
                  Active
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Email Verified
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEmailVerified"
                  checked={isEmailVerified}
                  onChange={(e) => setIsEmailVerified(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-650 focus:ring-indigo-500/30"
                />
                <label htmlFor="isEmailVerified" className="text-xs text-slate-300 select-none">
                  Verified
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800/40">
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
