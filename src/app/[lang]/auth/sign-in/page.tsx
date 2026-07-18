"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ShieldAlert, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { LoginFormValues, loginSchema } from "@/validation/auth.validation";
import { useSignInMutation } from "@/redux/features/auth/auth.api";
import { saveToken } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const lang = params?.lang || "en";

  const [showPassword, setShowPassword] = useState(false);
  const [signIn, { isLoading: loading }] = useSignInMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "mdmurad.dev2004@gmail.com",
      password: "12345%%murad"
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await signIn({
        email: data.email,
        password: data.password,
      }).unwrap();
      await saveToken(response.access, response.refresh);
      toast("Sign in successful!", "success");
      router.push(`/${lang}/admin`);
    } catch (error: any) {
      const errorMsg = error?.data?.detail || error?.data?.message || "Invalid credentials. Please try again.";
      toast(errorMsg, "error");
    }
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <div className="p-3 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/20 mb-4 animate-bounce duration-1000">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1.5">
          Sign in to your SportNews Admin Panel
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            disabled={loading}
            className={`w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${errors.email
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              href={`/${lang}/auth/forgot-password`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full pl-4 pr-10 py-3 bg-slate-950/50 focus:bg-slate-950 border rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${errors.password
                ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
                }`}
              {...register("password")}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-indigo-800 disabled:to-indigo-900 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
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
              Verifying credentials...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Background Decorative Rings */}
      <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full border border-indigo-500/5 bg-indigo-500/2 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-48 h-48 rounded-full border border-emerald-500/5 bg-emerald-500/2 pointer-events-none" />
    </div>
  );
}
