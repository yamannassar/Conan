// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { exportData, importData } from '@/lib/backup';
import { useTheme } from '@/hooks/useTheme';
import ContentCard from '@/components/ContentCard';
import StatsCard from '@/components/StatsCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';

const queryClient = new QueryClient();

function MainApp() {
    const [activeTab, setActiveTab] = useState<'anime' | 'manga' | 'movies' | 'ova'>('anime');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: 'all', type: 'all', sort: 'number_asc' });
    const { theme, toggleTheme } = useTheme();

    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: api.getStats
    });

    const { data: content, refetch } = useQuery({
        queryKey: ['content', activeTab, searchQuery, filters],
        queryFn: () => api.getContent(activeTab, { search: searchQuery, ...filters })
    });

    const updateProgress = useMutation({
        mutationFn: api.updateProgress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
        }
    });

    const handleStatusChange = (type: string, id: number, status: string) => {
        updateProgress.mutate({ contentType: type, contentId: id, status });
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const data = await importData(file);
            if (data) {
                // Process imported data
                refetch();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conan Tracker</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={() => exportData({})}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                            Export
                        </button>
                        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                            Import
                            <input type="file" hidden onChange={handleImport} accept=".json" />
                        </label>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <StatsCard title="Episodes" stats={stats.episodes} />
                        <StatsCard title="Chapters" stats={stats.chapters} />
                        <StatsCard title="Movies" stats={stats.movies} />
                        <StatsCard title="OVAs" stats={stats.ovas} />
                    </div>
                )}

                <div className="flex gap-2 mb-6">
                    {(['anime', 'manga', 'movies', 'ova'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium ${
                                activeTab === tab
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                <SearchBar query={searchQuery} onChange={setSearchQuery} placeholder={`Search ${activeTab}...`} />
                <FilterBar filters={filters} onChange={setFilters} />

                <div className="mt-6 space-y-4">
                    {content?.data?.map((item: any) => (
                        <ContentCard
                            key={item.id}
                            item={item}
                            type={activeTab === 'anime' || activeTab === 'ova' ? 'episode' : activeTab === 'manga' ? 'chapter' : 'movie'}
                            progress={item.progress?.[0] || {}}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <MainApp />
        </QueryClientProvider>
    );
}