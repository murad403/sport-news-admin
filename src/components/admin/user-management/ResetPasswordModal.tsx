"use client";

import React, { useState, useEffect } from "react";
import { X, Key, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  userName,
}: ResetPasswordModalProps) {
  const { toast } = useToast();
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate a temporary random password
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setTempPassword(`SportNewsTemp-${password}`);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast("Password copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Reset User Password</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            You are resetting the password for user <span className="font-semibold text-slate-200">"{userName}"</span>. A new temporary password has been auto-generated. Please copy it and send it to the user. They will be forced to change it on their next login.
          </p>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-semibold text-amber-300 break-all select-all">
              {tempPassword}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <p className="text-[10px] text-amber-300 leading-relaxed">
              <strong>Security Warning:</strong> This password is only shown once. Ensure you copy this token before closing the modal, otherwise you will have to regenerate a new one.
            </p>
          </div>

          <div className="flex pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
            >
              Done, Close Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
