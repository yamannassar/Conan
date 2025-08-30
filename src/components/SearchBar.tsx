import React from "react";

interface SearchBarProps {
    query: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => {
    return (
        <div className="flex items-center p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <input
                type="text"
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-4 py-2 rounded-l-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
            <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-r-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition">
                Search
            </button>
        </div>
    );
};
