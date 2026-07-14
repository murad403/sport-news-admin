"use client";

import React from "react";
import { Activity as ActivityIcon } from "lucide-react";
import { Activity } from "@/redux/features/dashboard/dashboard.type";

interface RecentActivitiesProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export default function RecentActivities({ activities = [], isLoading = false }: RecentActivitiesProps) {
  const getActionStyle = (action: string) => {
    switch (action.toLowerCase()) {
      case "created":
        return "text-indigo-400 bg-indigo-500/5 border-indigo-500/10";
      case "approved":
        return "text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
      case "deleted":
        return "text-rose-400 bg-rose-500/5 border-rose-500/10";
      case "rejected":
        return "text-rose-400 bg-rose-500/5 border-rose-500/10";
      case "updated":
      default:
        return "text-sky-400 bg-sky-500/5 border-sky-500/10";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-4">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Recent Activities</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/30 text-[10px] font-semibold text-slate-550 uppercase tracking-wider">
              <th className="py-3 px-2">User / Actor</th>
              <th className="py-3 px-2">Action</th>
              <th className="py-3 px-2">Target Resource</th>
              <th className="py-3 px-2 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/20 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  Loading activity logs...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No recent activities recorded.
                </td>
              </tr>
            ) : (
              activities.slice(0, 10).map((act) => (
                <tr key={act.id} className="hover:bg-slate-900/20 transition-colors group">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                        {getInitials(act.actor_name)}
                      </div>
                      <span className="font-semibold text-slate-200 truncate max-w-[200px]" title={act.actor_name}>
                        {act.actor_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="text-slate-400 capitalize">
                      {act.action} {act.content_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-medium inline-block truncate max-w-[200px] text-center ${getActionStyle(act.action)}`} title={act.object_repr}>
                      {act.object_repr}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right text-slate-500 group-hover:text-slate-400 transition-colors">
                    {formatTime(act.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}