"use client";

import React, { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import DashboardStats from "./DashboardStats";
import ArticleGenerationActivity from "./ArticleGenerationActivity";
import CategoryShare from "./CategoryShare";
import RecentActivities from "./RecentActivities";

export default function DashboardPage() {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast("Dashboard stats updated successfully", "success");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sports article generation trends and submission metrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Jul 2, 2026 - Jul 9, 2026</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Refresh statistics"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? "animate-spin text-indigo-400" : "group-hover:rotate-45 transition-transform"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <DashboardStats />

      {/* Charts Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ArticleGenerationActivity />
        <CategoryShare />
      </div>

      {/* Recent Activities Section */}
      <RecentActivities />
    </div>
  );
}