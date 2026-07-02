"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, BookOpen, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const lang = params?.lang || "en";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("OTP code sent to your email!", "success");
      // Redirect to verification screen, passing email as query parameter
      router.push(`/${lang}/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    }, 1500);
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Back Button */}
      <Link
        href={`/${lang}/auth/signin`}
        className="absolute top-6 left-6 text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-6 mb-8 relative z-10">
        <div className="p-3 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/20 mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
          Enter your email address and we'll send you a 6-digit OTP code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            disabled={loading}
            className={`w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${
              errors.email
                ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-indigo-800 disabled:to-indigo-900 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4.5 w-4.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending OTP...
            </>
          ) : (
            "Request Reset Link"
          )}
        </button>
      </form>

      {/* Background Decorative Rings */}
      <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full border border-indigo-500/5 bg-indigo-500/2 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-48 h-48 rounded-full border border-emerald-500/5 bg-emerald-500/2 pointer-events-none" />
    </div>
  );
}
