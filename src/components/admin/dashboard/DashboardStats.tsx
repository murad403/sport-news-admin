"use client";

import React from "react";
import { FileText, Clock, CheckCircle, Eye, Users, Mail, Layers, Tag } from "lucide-react";
import { DashboardSummaryResponse } from "@/redux/features/dashboard/dashboard.type";

interface DashboardStatsProps {
  summary?: DashboardSummaryResponse;
}

export default function DashboardStats({ summary }: DashboardStatsProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800/80 animate-pulse" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Articles",
      value: summary.news?.total ?? 0,
      detail: `${summary.news?.new_last_7_days ?? 0} new last 7 days`,
      icon: FileText,
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/30 text-indigo-400",
    },
    {
      title: "Pending Requests",
      value: summary.news?.pending ?? 0,
      detail: "Awaiting administrator review",
      icon: Clock,
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/30 text-amber-400",
    },
    {
      title: "Approved Articles",
      value: summary.news?.approved ?? 0,
      detail: `${summary.news?.rejected ?? 0} rejected submissions`,
      icon: CheckCircle,
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Total Article Views",
      value: (summary.news?.total_views ?? 0).toLocaleString(),
      detail: "Cumulative traffic metrics",
      icon: Eye,
      bg: "bg-sky-500/10",
      border: "hover:border-sky-500/30 text-sky-400",
    },
    {
      title: "Total Users",
      value: summary.users?.total ?? 0,
      detail: `${summary.users?.new_last_7_days ?? 0} new last 7 days`,
      icon: Users,
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/30 text-purple-400",
    },
    {
      title: "Active Newsletter",
      value: `${summary.newsletter?.active ?? 0}/${summary.newsletter?.total ?? 0}`,
      detail: "Subscribed readers list",
      icon: Mail,
      bg: "bg-pink-500/10",
      border: "hover:border-pink-500/30 text-pink-400",
    },
    {
      title: "Categories",
      value: summary.categories_count ?? 0,
      detail: "Sports news groupings",
      icon: Layers,
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/30 text-rose-400",
    },
    {
      title: "Tags",
      value: summary.tags_count ?? 0,
      detail: "Search tags cataloged",
      icon: Tag,
      bg: "bg-teal-500/10",
      border: "hover:border-teal-500/30 text-teal-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{stat.title}</span>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.border.split(" ")[2]} shadow-inner`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
            </div>

            <p className="text-[10px] text-slate-500 mt-1.5">{stat.detail}</p>
          </div>
        );
      })}
    </div>
  );
}