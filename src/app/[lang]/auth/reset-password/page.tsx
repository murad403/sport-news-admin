"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff, ShieldAlert, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { resetPasswordSchema, ResetPasswordValues } from "@/validation/auth.validation";



export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const lang = params?.lang || "en";

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password", "");

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", score: 0, color: "bg-slate-800" };
    if (pass.length < 6) return { label: "Too Short", score: 1, color: "bg-rose-500" };

    let score = 2;
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);

    if (hasNum) score++;
    if (hasSpecial) score++;
    if (hasUpper) score++;

    if (score <= 2) return { label: "Weak", score: 2, color: "bg-orange-500" };
    if (score <= 4) return { label: "Medium", score: 3, color: "bg-amber-500" };
    return { label: "Strong", score: 4, color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = (data: ResetPasswordValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Password reset successfully! Please sign in.", "success");
      router.push(`/${lang}/auth/signin`);
    }, 1500);
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <div className="p-3 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/20 mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-400 mt-1.5">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full pl-4 pr-10 py-3 bg-slate-950/50 focus:bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${errors.password
                  ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                  : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
                }`}
              {...register("password")}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Password Strength Meter */}
        {passwordVal && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Password Strength:</span>
              <span className="font-semibold text-slate-200">{strength.label}</span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full pl-4 pr-10 py-3 bg-slate-950/50 focus:bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${errors.confirmPassword
                  ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                  : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
                }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Action Button */}
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
              Updating password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      {/* Background Decorative Rings */}
      <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full border border-indigo-500/5 bg-indigo-500/2 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-48 h-48 rounded-full border border-emerald-500/5 bg-emerald-500/2 pointer-events-none" />
    </div>
  );
}
