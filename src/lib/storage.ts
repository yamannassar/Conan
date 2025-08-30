export type ProgressStatus = "not_started" | "watched" | "rewatched";

export interface ProgressRecord {
    type: "episode" | "chapter" | "movie";
    id: number;
    status: ProgressStatus;
    watchCount?: number;
    firstWatched?: string | null;
    lastWatched?: string | null;
    rating?: number;
    notes?: string;
    isFavorite?: boolean;
}

type ProgressMap = Record<string, ProgressRecord>;
type Settings = Record<string, unknown>;

const PROGRESS_KEY = "conanTrackerProgress";
const SETTINGS_KEY = "conanTrackerSettings";

const isBrowser = () => typeof window !== "undefined";

export const StorageService = {
    getUserProgress(): ProgressMap {
        if (!isBrowser()) return {};
        const raw = localStorage.getItem(PROGRESS_KEY);
        return raw ? (JSON.parse(raw) as ProgressMap) : {};
    },
    saveUserProgress(progress: ProgressMap) {
        if (!isBrowser()) return;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    },
    mergeProgress(incoming: ProgressMap) {
        const current = this.getUserProgress();
        const merged = { ...current, ...incoming };
        this.saveUserProgress(merged);
        return merged;
    },
    getSettings(): Settings {
        if (!isBrowser()) return {};
        const raw = localStorage.getItem(SETTINGS_KEY);
        return raw ? (JSON.parse(raw) as Settings) : {};
    },
    saveSettings(settings: Settings) {
        if (!isBrowser()) return;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
};
