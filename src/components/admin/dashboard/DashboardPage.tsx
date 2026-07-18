"use client";

import React, { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import DashboardStats from "./DashboardStats";
import ArticleGenerationActivity from "./ArticleGenerationActivity";
import RecentActivities from "./RecentActivities";
import {
  useGetActivityQuery,
  useGetNewsAnalyticsTrendQuery,
  useGetSummaryQuery,
} from "@/redux/features/dashboard/dashboard.api";

export default function DashboardPage() {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const { data: summaryData, refetch: refetchSummary, isLoading: isSummaryLoading } = useGetSummaryQuery();
  const { data: trendData, refetch: refetchTrend, isLoading: isTrendLoading } = useGetNewsAnalyticsTrendQuery();
  const { data: activityData, refetch: refetchActivity, isLoading: isActivityLoading } = useGetActivityQuery();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchSummary(),
        refetchTrend(),
        refetchActivity(),
      ]);
      toast("Dashboard stats updated successfully", "success");
    } catch {
      toast("Failed to update dashboard statistics", "error");
    } finally {
      setRefreshing(false);
    }
  };

  const displayDateRange = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return `${lastWeek.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} - ${today.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const isPageLoading = isSummaryLoading || isTrendLoading || isActivityLoading;

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
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{displayDateRange()}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || isPageLoading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Refresh statistics"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-400" : "group-hover:rotate-45 transition-transform"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <DashboardStats summary={summaryData} />

      {/* Charts Visualization Section */}
      <div className="grid grid-cols-1 gap-6">
        <ArticleGenerationActivity trend={trendData} />
      </div>

      {/* Recent Activities Section */}
      <RecentActivities activities={activityData?.results} isLoading={isActivityLoading} />
    </div>
  );
}