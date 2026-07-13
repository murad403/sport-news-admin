"use client";

import React from "react";
import { X, ShieldCheck, Info, ShieldAlert } from "lucide-react";
import { useGetUserDetailsQuery } from "@/redux/features/users/users.api";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const { data: user, isLoading } = useGetUserDetailsQuery(userId, {
    skip: !isOpen || !userId,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">User Details</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-[10px] text-slate-500">Loading user profile details...</p>
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border border-slate-700 object-cover shadow-inner"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-lg text-indigo-300 uppercase">
                  {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-white truncate">{user.name}</h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 text-[9px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-md tracking-wider uppercase">
                    {user.role}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border tracking-wider uppercase flex items-center gap-1 ${
                    user.is_active 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Bio</span>
                <span className="text-slate-300 text-right max-w-[240px] wrap-break-word">
                  {user.bio || <span className="text-slate-600 italic">No biography provided.</span>}
                </span>
              </div>
              <div className="border-t border-slate-800/40 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Email Verified</span>
                <span className={`flex items-center gap-1 font-semibold ${user.is_email_verified ? "text-emerald-400" : "text-rose-400"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user.is_email_verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="border-t border-slate-800/40 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[9px]">Joined Date</span>
                <span className="text-slate-300 font-medium">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-rose-500/80" />
            <p className="text-xs">Failed to load profile details.</p>
          </div>
        )}
      </div>
    </div>
  );
}