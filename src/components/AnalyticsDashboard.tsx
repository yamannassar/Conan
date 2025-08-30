"use client";
import React, { useMemo } from "react";
import type { ProgressRecord } from "../lib/storage";

interface Props {
    progress: Record<string, ProgressRecord>;
}

function makeDailyCounts(progress: Record<string, ProgressRecord>) {
    const map: Record<string, number> = {};
    Object.values(progress).forEach(p => {
        if (p.lastWatched) {
            const day = new Date(p.lastWatched).toLocaleDateString();
            map[day] = (map[day] || 0) + 1;
        }
    });
    return map;
}

export default function AnalyticsDashboard({ progress }: Props) {
    const { counts, totalWatches, streak } = useMemo(() => {
        const counts = makeDailyCounts(progress);
        const totalWatches = Object.values(counts).reduce((a, b) => a + b, 0);

        // حساب streak بسيط لآخر أيام
        const today = new Date();
        let current = 0;
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toLocaleDateString();
            if (counts[key]) current++;
            else break;
        }
        return { counts, totalWatches, streak: current };
    }, [progress]);

    const last15 = useMemo(() => {
        const arr: { day: string; count: number }[] = [];
        const today = new Date();
        for (let i = 14; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toLocaleDateString();
            arr.push({ day: key, count: counts[key] || 0 });
        }
        return arr;
    }, [counts]);

    return (
        <div className="rounded-2xl p-4 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
            <div className="flex gap-6 mb-4">
                <div>Watches (30d): <b>{totalWatches}</b></div>
                <div>Current Streak: <b>{streak}d</b></div>
            </div>
            <div className="grid grid-cols-15 gap-1">
                {last15.map((d, idx) => (
                    <div
                        key={idx}
                        title={`${d.day}: ${d.count}`}
                        className="h-6 rounded"
                        style={{
                            background: d.count === 0 ? '#e5e7eb' :
                                d.count === 1 ? '#9ca3af' :
                                    d.count === 2 ? '#6b7280' : '#374151'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
