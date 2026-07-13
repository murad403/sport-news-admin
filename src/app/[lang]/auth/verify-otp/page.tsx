"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useVerifyOtpMutation, useSendOtpMutation } from "@/redux/features/auth/auth.api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const lang = params?.lang || "en";
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [verifyOtp, { isLoading: loading }] = useVerifyOtpMutation();
  const [sendOtp] = useSendOtpMutation();
  const [timeLeft, setTimeLeft] = useState(59);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Count down timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Handle key input
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    setError("");
    const newOtp = [...otp];
    // Keep only last character if pasted/typed multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace/key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      setError("");
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty and backspace pressed
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const chars = pastedData.split("");
      setOtp(chars);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      await sendOtp({ email, purpose: "reset_password" }).unwrap();
      setTimeLeft(59);
      toast("A new 6-digit OTP code has been sent!", "info");
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to resend OTP. Please try again.";
      toast(errorMsg, "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit OTP code.");
      return;
    }

    try {
      const response = await verifyOtp({
        email,
        otp: code,
        purpose: "reset_password"
      }).unwrap();

      toast(response.message || "OTP code verified successfully!", "success");
      router.push(`/${lang}/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const errorMsg = err?.data?.detail || err?.data?.message || "Failed to verify OTP. Please try again.";
      setError(errorMsg);
      toast(errorMsg, "error");
    }
  };

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Back Button */}
      <Link
        href={`/${lang}/auth/forgot-password`}
        className="absolute top-6 left-6 text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-6 mb-8 relative z-10">
        <div className="p-3 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/20 mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Verify Identity</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-[300px] mx-auto leading-relaxed">
          We sent a code to <span className="text-indigo-300 font-medium truncate inline-block max-w-[200px] align-bottom">{email}</span>. Enter it below to proceed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* OTP Input Fields */}
        <div className="flex items-center justify-between gap-2 max-w-[320px] mx-auto">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              value={digit}
              disabled={loading}
              onChange={(e) => handleChange(e.target, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className={`w-12 h-14 text-center bg-slate-950/60 border rounded-xl text-lg font-bold text-slate-100 placeholder-slate-800 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-950 ${
                error
                  ? "border-rose-500/50"
                  : digit
                  ? "border-indigo-500/40"
                  : "border-slate-800"
              }`}
            />
          ))}
        </div>

        {error && (
          <span className="flex items-center justify-center gap-1.5 text-xs text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            {error}
          </span>
        )}

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
              Verifying Code...
            </>
          ) : (
            "Verify & Continue"
          )}
        </button>

        {/* Resend Timer Text */}
        <div className="text-center text-xs">
          {timeLeft > 0 ? (
            <p className="text-slate-500">
              Resend code in <span className="text-indigo-400 font-semibold">{timeLeft}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors focus:outline-none"
            >
              Resend OTP Code
            </button>
          )}
        </div>
      </form>

      {/* Background Decorative Rings */}
      <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full border border-indigo-500/5 bg-indigo-500/2 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-48 h-48 rounded-full border border-emerald-500/5 bg-emerald-500/2 pointer-events-none" />
    </div>
  );
}
