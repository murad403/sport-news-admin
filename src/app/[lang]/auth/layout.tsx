"use client";

import React from "react";
import { ToastProvider } from "@/components/ui/toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 p-4 selection:bg-indigo-500 selection:text-white relative">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
