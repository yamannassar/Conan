import React, { useState } from "react";

interface ContentCardProps {
    item: any;
    type: string;
    progress: any;
    onStatusChange: (type: string, id: number, status: string) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, type, progress, onStatusChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const key = `${type}_${item.id}`;
    const itemProgress = progress[key];
    const status = itemProgress?.status || 'not_started';

    const statusColors: Record<string, string> = {
        not_started: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        watched: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        rewatched: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };

    const statusLabels: Record<string, string> = {
        not_started: 'Not Started',
        watched: type === 'chapter' ? 'Read' : 'Watched',
        rewatched: type === 'chapter' ? 'Reread' : 'Rewatched'
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
                    onClick={() => {
                        const nextStatus = status === 'not_started' ? 'watched' : status === 'watched' ? 'rewatched' : 'not_started';
                        onStatusChange(type, item.id, nextStatus);
                    }}
                >
          {statusLabels[status]}
        </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Number: {item.number}</p>
            {item.date && <p className="text-sm text-gray-500 dark:text-gray-400">Date: {item.date}</p>}
            <button
                className="mt-2 text-blue-500 dark:text-blue-400 text-sm"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>
            {isExpanded && <pre className="text-xs mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">{JSON.stringify(item, null, 2)}</pre>}
        </div>
    );
};
