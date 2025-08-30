import React from "react";

interface FilterBarProps {
    filters: {
        status: string;
        type: string;
        sort: string;
    };
    onChange: (newFilters: any) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
    return (
        <div className="flex flex-wrap gap-2 p-4 glass-morphism rounded-xl">
            <select
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            >
                <option value="all">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="watched">Watched/Read</option>
                <option value="rewatched">Rewatched/Reread</option>
            </select>

            <select
                value={filters.type}
                onChange={(e) => onChange({ ...filters, type: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            >
                <option value="all">All Types</option>
                <option value="canon">Canon Only</option>
                <option value="filler">Filler Only</option>
                <option value="important">Important Only</option>
            </select>

            <select
                value={filters.sort}
                onChange={(e) => onChange({ ...filters, sort: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            >
                <option value="number_asc">Number ↑</option>
                <option value="number_desc">Number ↓</option>
                <option value="date_asc">Date ↑</option>
                <option value="date_desc">Date ↓</option>
            </select>
        </div>
    );
};
