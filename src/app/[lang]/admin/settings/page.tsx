"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, KeyRound, ShieldAlert, Upload, Sparkles, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

// Schema for Change Password Form
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordChangeSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile Info States
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex.mercer@sportnews.com");
  const [specializations, setSpecializations] = useState<string[]>(["Soccer", "F1"]);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Form setup for Password
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordVal = watch("newPassword", "");

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

  const strength = getPasswordStrength(newPasswordVal);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast("Name and email are required fields", "error");
      return;
    }

    setProfileSaving(true);
    setTimeout(() => {
      setProfileSaving(false);
      toast("Profile information saved successfully", "success");
    }, 1200);
  };

  const handleAvatarUpload = () => {
    setAvatarLoading(true);
    setTimeout(() => {
      setAvatarLoading(false);
      toast("Profile picture uploaded successfully!", "success");
    }, 1500);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    setProfileSaving(true);
    setTimeout(() => {
      setProfileSaving(false);
      toast("Password changed successfully", "success");
      reset(); // Clear form
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, credentials, and configuration preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side Tab Navigation */}
        <div className="md:col-span-1 p-2 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-lg flex flex-row md:flex-col gap-1.5 w-full">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "password"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            Security & Password
          </button>
        </div>

        {/* Right Side Form Content */}
        <div className="md:col-span-3 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg min-h-[380px]">
          {/* PROFILE INFO TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-white">Profile Information</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Update public metadata details.</p>
              </div>

              {/* Avatar Uploader Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-800/20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-lg text-indigo-300 shadow-inner">
                    {avatarLoading ? (
                      <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      "AM"
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-left leading-relaxed">
                  <p className="text-xs font-semibold text-slate-200">Avatar Photograph</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG, or GIF up to 2MB.</p>
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={avatarLoading}
                    className="mt-2.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-slate-200 transition-all inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Form details */}
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-550 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-xs text-slate-100 placeholder-slate-550 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Role */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      Admin Role
                    </label>
                    <input
                      type="text"
                      value="Super Admin"
                      disabled
                      className="w-full px-4 py-2.5 bg-slate-950/30 border border-slate-850/60 rounded-xl text-xs text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Specialization Categories tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Assigned Categories
                    </label>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {["Soccer", "Tennis", "Basketball", "F1"].map((sport) => {
                        const isSelected = specializations.includes(sport);
                        return (
                          <button
                            key={sport}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSpecializations(specializations.filter((s) => s !== sport));
                              } else {
                                setSpecializations([...specializations, sport]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all flex items-center gap-1 ${
                              isSelected
                                ? "bg-indigo-950/40 border-indigo-550 text-indigo-300"
                                : "bg-slate-950 border-slate-800 text-slate-400"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                            {sport}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Save Profile Button */}
                <div className="pt-4 border-t border-slate-800/20 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] flex items-center gap-1.5"
                  >
                    {profileSaving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving Changes...
                      </>
                    ) : (
                      "Save Profile Details"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CHANGE PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-white">Change Password</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Ensure your account is protected with a complex passphrase.</p>
              </div>

              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none transition-all ${
                      errors.currentPassword
                        ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                        : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
                    }`}
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <span className="flex items-center gap-1.5 text-[10px] text-rose-400 mt-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.currentPassword.message}
                    </span>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none transition-all ${
                      errors.newPassword
                        ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                        : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
                    }`}
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <span className="flex items-center gap-1.5 text-[10px] text-rose-400 mt-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>

                {/* Password Strength Indicator */}
                {newPasswordVal && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-450">Passphrase complexity:</span>
                      <span className="font-semibold text-slate-300">{strength.label}</span>
                    </div>
                    <div className="h-1 bg-slate-950 rounded-full overflow-hidden flex gap-0.5">
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
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-slate-950/50 focus:bg-slate-950 border rounded-xl text-xs text-slate-100 placeholder-slate-600 outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                        : "border-slate-800 focus:ring-1 focus:ring-indigo-500/50"
                    }`}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <span className="flex items-center gap-1.5 text-[10px] text-rose-400 mt-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-800/20 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]"
                  >
                    Update Password passphrase
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
