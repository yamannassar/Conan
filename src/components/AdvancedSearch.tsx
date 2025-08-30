"use client";
import React from "react";
import type { AdvancedSearchParams } from "../lib/search";

interface Props {
    value: AdvancedSearchParams;
    onChange: (v: AdvancedSearchParams) => void;
}

export default function AdvancedSearch({ value, onChange }: Props) {
    const set = <K extends keyof AdvancedSearchParams>(key: K, val: AdvancedSearchParams[K]) =>
        onChange({ ...value, [key]: val });

    return (
        <div className="grid gap-3 md:grid-cols-4 p-4 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
            <input
                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="بحث متقدم..."
                value={value.query}
                onChange={e => set("query", e.target.value)}
            />
            <div className="flex gap-2">
                <input
                    type="date"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={value.dateRange.start ?? ""}
                    onChange={e => set("dateRange", { ...value.dateRange, start: e.target.value || null })}
                />
                <input
                    type="date"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={value.dateRange.end ?? ""}
                    onChange={e => set("dateRange", { ...value.dateRange, end: e.target.value || null })}
                />
            </div>
            <select
                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={value.caseType}
                onChange={e => set("caseType", e.target.value as any)}
            >
                <option value="all">كل الأنواع</option>
                <option value="murder">Murder</option>
                <option value="theft">Theft</option>
                <option value="kidnapping">Kidnapping</option>
                <option value="other">Other</option>
            </select>
            <input
                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tags (افصل بفواصل)"
                value={value.tags.join(", ")}
                onChange={e => set("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
            />
        </div>
    );
}
