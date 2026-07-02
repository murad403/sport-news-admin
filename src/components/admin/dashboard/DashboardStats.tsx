"use client";

import React from "react";
import { FileText, Clock, CheckCircle, Cpu, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Articles",
      value: "1,248",
      change: "+12.5%",
      isPositive: true,
      timeframe: "from last week",
      icon: FileText,
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/30",
    },
    {
      title: "Pending Requests",
      value: "42",
      change: "-4.2%",
      isPositive: true, // Decreasing pending requests is positive
      timeframe: "from yesterday",
      icon: Clock,
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/30",
    },
    {
      title: "Accepted Articles",
      value: "912",
      change: "+18.2%",
      isPositive: true,
      timeframe: "from last month",
      icon: CheckCircle,
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/30",
    },
    {
      title: "AI Words Generated",
      value: "148.9K",
      change: "+24.1%",
      isPositive: true,
      timeframe: "from last week",
      icon: Cpu,
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/30",
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
              <div className={`p-2.5 rounded-xl ${stat.bg} text-slate-200 shadow-inner`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
              <span
                className={`text-[10px] font-bold flex items-center px-1.5 py-0.5 rounded-md ${
                  stat.isPositive
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-rose-400 bg-rose-500/10"
                }`}
              >
                {stat.isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
                )}
                {stat.change}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 mt-1">{stat.timeframe}</p>
          </div>
        );
      })}
    </div>
  );
}