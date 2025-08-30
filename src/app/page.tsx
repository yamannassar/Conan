"use client";

import { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import ProgressRing from '../components/ProgressRing';
import StatsCard from '../components/StatsCard';
import { ContentCard } from '../components/ContentCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { TVIcon, BookIcon, MovieIcon } from '../components/Icons';
import { BackupService } from '../lib/backup';
import AnalyticsDashboard from "../components/AnalyticsDashboard"

type Episode = {
    id: number;
    number: number;
    title: string;
    titleJapanese?: string;
    airDate: string;
    isFiller: boolean;
    isImportant: boolean;
    mangaSource?: string;
    duration: number;
};

type Chapter = {
    id: number;
    number: number;
    volume: number;
    title: string;
    titleJapanese?: string;
    releaseDate: string;
    pageCount: number;
    isImportant: boolean;
};

type Movie = {
    id: number;
    number: number;
    title: string;
    titleJapanese?: string;
    releaseDate: string;
    duration: number;
    chronologicalPlacement: number;
};

const ThemeContext = createContext<any>(null);

const ThemeProvider = ({ children }: any) => {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDark]);
    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

export default function Home() {
    const [activeTab, setActiveTab] = useState<'anime' | 'manga' | 'movies'>('anime');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ status: 'all', type: 'all', sort: 'number_asc' });
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [progress, setProgress] = useState<any>({});
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Load progress from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('conanTrackerProgress');
        if (stored) setProgress(JSON.parse(stored));
    }, []);

    // Fetch Data from API
    useEffect(() => {
        fetch('/api/episodes').then(r => r.json()).then(setEpisodes);
        fetch('/api/chapters').then(r => r.json()).then(setChapters);
        fetch('/api/movies').then(r => r.json()).then(setMovies);
    }, []);

    const handleStatusChange = useCallback((type: string, id: number, status: string) => {
        const key = `${type}_${id}`;
        const newProgress = { ...progress };
        if (!newProgress[key]) {
            newProgress[key] = {
                type,
                id,
                status,
                watchCount: 1,
                firstWatched: new Date().toISOString(),
                lastWatched: new Date().toISOString()
            };
        } else {
            newProgress[key].status = status;
            newProgress[key].lastWatched = new Date().toISOString();
        }
        localStorage.setItem('conanTrackerProgress', JSON.stringify(newProgress));
        setProgress(newProgress);
    }, [progress]);

    const getFilteredContent = useMemo(() => {
        let content: any[] = [];
        let contentType = '';
        switch (activeTab) {
            case 'anime': content = episodes; contentType = 'episode'; break;
            case 'manga': content = chapters; contentType = 'chapter'; break;
            case 'movies': content = movies; contentType = 'movie'; break;
        }
        // search
        if (searchQuery) {
            content = content.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return { content, type: contentType };
    }, [activeTab, searchQuery, episodes, chapters, movies]);

    // Backup & Import Handlers
    const handleExport = () => {
        BackupService.exportData(progress);
    };

    const handleImport = async (file: File) => {
        const imported = await BackupService.importData(file);
        if (imported) {
            setProgress(imported);
            localStorage.setItem('conanTrackerProgress', JSON.stringify(imported));
        }
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
                <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 p-4 shadow flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Conan Tracker</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                        >
                            {showAnalytics ? "Close Analytics" : "Analytics"}
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Export
                        </button>
                        <label className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer">
                            Import
                            <input type="file" accept=".json" hidden onChange={(e) => e.target.files && handleImport(e.target.files[0])} />
                        </label>
                        <ThemeToggle />
                    </div>
                </header>

                <main className="max-w-5xl mx-auto p-4">
                    <div className="flex gap-2 mb-4">
                        {['anime', 'manga', 'movies'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded ${activeTab === tab
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <SearchBar query={searchQuery} onChange={setSearchQuery} placeholder={`Search ${activeTab}`} />
                    <FilterBar filters={filters} onChange={setFilters} />

                    {showAnalytics ? (
                        <div className="mt-6">
                            <AnalyticsDashboard progress={progress} data={{ episodes, chapters, movies }} />
                        </div>
                    ) : (
                        <div className="mt-4 space-y-2">
                            {getFilteredContent.content.map(item => (
                                <ContentCard
                                    key={item.id}
                                    item={item}
                                    type={getFilteredContent.type}
                                    progress={progress}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ThemeProvider>
    );
}
