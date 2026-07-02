"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const trendData = [
  { name: "Mon", "AI Generated": 12, "User Submissions": 8 },
  { name: "Tue", "AI Generated": 19, "User Submissions": 11 },
  { name: "Wed", "AI Generated": 15, "User Submissions": 14 },
  { name: "Thu", "AI Generated": 24, "User Submissions": 9 },
  { name: "Fri", "AI Generated": 22, "User Submissions": 18 },
  { name: "Sat", "AI Generated": 30, "User Submissions": 12 },
  { name: "Sun", "AI Generated": 28, "User Submissions": 15 },
];

export default function ArticleGenerationActivity() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Article Generation Activity
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Comparing AI-assisted writing against manual community drafts
          </p>
        </div>
      </div>

      <div className="h-80 w-full flex-1">
        {!mounted ? (
          <div className="h-full bg-slate-900/20 border border-slate-800/40 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-500">
            Loading activity data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis
                dataKey="name"
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  fontSize: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Area
                type="monotone"
                dataKey="AI Generated"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#aiGradient)"
              />
              <Area
                type="monotone"
                dataKey="User Submissions"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#userGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}