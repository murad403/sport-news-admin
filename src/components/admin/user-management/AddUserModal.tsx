"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Contributor" | "Viewer";
    status: "Active" | "Pending" | "Suspended";
  }) => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onConfirm,
}: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "Editor" | "Contributor" | "Viewer">("Contributor");
  const [status, setStatus] = useState<"Active" | "Pending" | "Suspended">("Pending");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setRole("Contributor");
      setStatus("Pending");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onConfirm({
        name: name.trim(),
        email: email.trim(),
        role,
        status,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Add New User</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Contributor">Contributor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500/50 rounded-xl text-xs text-slate-200 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-850 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
