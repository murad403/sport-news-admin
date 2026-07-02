"use client";

import React from "react";
import { Activity, ChevronRight } from "lucide-react";

interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: "ai" | "approve" | "reject" | "settings";
}

const recentActivities: ActivityLog[] = [
  {
    id: "act-1",
    user: "Alex Mercer",
    avatar: "AM",
    action: "generated an exciting article about",
    target: "F1 Monaco Grand Prix",
    time: "2 mins ago",
    type: "ai",
  },
  {
    id: "act-2",
    user: "Sarah Jenkins",
    avatar: "SJ",
    action: "approved a user submission",
    target: "Djokovic's Masterclass in Paris",
    time: "15 mins ago",
    type: "approve",
  },
  {
    id: "act-3",
    user: "Michael Scott",
    avatar: "MS",
    action: "rejected user request (duplicate content)",
    target: "Haaland's Transfer Speculations",
    time: "1 hour ago",
    type: "reject",
  },
  {
    id: "act-4",
    user: "Alex Mercer",
    avatar: "AM",
    action: "updated profile preferences in",
    target: "Admin Settings",
    time: "3 hours ago",
    type: "settings",
  },
];

export default function RecentActivities() {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Recent Activities</h3>
        </div>
        <button className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 transition-colors">
          View All Logs
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table representation */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/30 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-2">Administrator</th>
              <th className="py-3 px-2">Action Description</th>
              <th className="py-3 px-2">Target Resource</th>
              <th className="py-3 px-2 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/20 text-xs">
            {recentActivities.map((act) => {
              const styles = {
                ai: "text-indigo-400 bg-indigo-500/5 border-indigo-500/10",
                approve: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
                reject: "text-rose-400 bg-rose-500/5 border-rose-500/10",
                settings: "text-sky-400 bg-sky-500/5 border-sky-500/10",
              };

              return (
                <tr key={act.id} className="hover:bg-slate-900/20 transition-colors group">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                        {act.avatar}
                      </div>
                      <span className="font-semibold text-slate-200">{act.user}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="text-slate-400">{act.action}</span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${styles[act.type]}`}>
                      {act.target}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right text-slate-500 group-hover:text-slate-400 transition-colors">
                    {act.time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}