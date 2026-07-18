"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NewsAnalyticsTrend } from "@/redux/features/dashboard/dashboard.type";

interface ArticleGenerationActivityProps {
  trend?: NewsAnalyticsTrend[];
}

export default function ArticleGenerationActivity({ trend }: ArticleGenerationActivityProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format trend data for chart
  const chartData = (trend || []).map((item) => ({
    displayDay: new Date(item.day).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    Articles: item.count,
  }));

  return (
    <div className="lg:col-span-3 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-col">
      <style dangerouslySetInnerHTML={{
        __html: `
        .recharts-wrapper:focus,
        .recharts-surface:focus,
        .recharts-wrapper *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      `}} />
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Article Generation Activity
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Real-time trend analysis of published sports articles over time
          </p>
        </div>
      </div>

      <div className="relative w-full h-[320px]">
        {!mounted || !trend ? (
          <div className="absolute inset-0 bg-slate-900/20 border border-slate-800/40 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-500">
            Loading activity data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 border border-slate-800/40 rounded-lg flex items-center justify-center text-xs text-slate-500">
            No activity trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }}>
            <BarChart style={{ outline: "none" }} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis
                dataKey="displayDay"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#1e293b", opacity: 0.15 }}
              />
              <Bar
                dataKey="Articles"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}