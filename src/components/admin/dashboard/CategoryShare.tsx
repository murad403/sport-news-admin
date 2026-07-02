"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const categoryData = [
    { name: "Soccer", value: 520, color: "#6366f1" }, // Indigo
    { name: "Tennis", value: 210, color: "#10b981" }, // Emerald
    { name: "Basketball", value: 340, color: "#f59e0b" }, // Amber
    { name: "F1", value: 178, color: "#f43f5e" }, // Rose
];

export default function CategoryShare() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50 mb-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-200">Category Share</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        Article distribution across sports categories
                    </p>
                </div>
            </div>

            <div className="h-60 w-full flex-1 relative flex items-center justify-center">
                {!mounted ? (
                    <div className="h-full w-full bg-slate-900/20 border border-slate-800/40 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-500">
                        Loading categories...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#0f172a",
                                    borderColor: "#334155",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
        )}
            {mounted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
                    <span className="text-2xl font-bold text-white">1,248</span>
                    <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">Articles</span>
                </div>
            )}
        </div>

      {/* Custom Legends list */ }
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {categoryData.map((cat) => (
            <div
                key={cat.name}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/30 transition-colors"
            >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-400 truncate">{cat.name}</span>
                <span className="font-semibold text-slate-200 ml-auto">{((cat.value / 1248) * 100).toFixed(0)}%</span>
            </div>
        ))}
    </div>
    </div>
  );
}