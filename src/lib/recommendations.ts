import type { ProgressRecord } from "./storage";

export interface EpisodeLike {
    id: number;
    number: number;
    duration?: number | null;
    isImportant?: boolean;
}

type ProgressMap = Record<string, ProgressRecord>;

export const RecommendationEngine = {
    getNextEpisode(progress: ProgressMap, episodes: EpisodeLike[]) {
        const important = episodes
            .filter(ep => ep.isImportant)
            .filter(ep => {
                const key = `episode_${ep.id}`;
                const p = progress[key];
                return !p || p.status === "not_started";
            })
            .sort((a, b) => a.number - b.number);

        return important[0] ?? null;
    },

    suggestBingeList(availableHours: number, episodes: EpisodeLike[], progress: ProgressMap) {
        const totalMinutes = Math.floor(availableHours * 60);
        const unwatched = episodes
            .filter(ep => {
                const key = `episode_${ep.id}`;
                return !progress[key] || progress[key].status === "not_started";
            })
            .sort((a, b) => a.number - b.number);

        const list: EpisodeLike[] = [];
        let acc = 0;
        for (const ep of unwatched) {
            const dur = ep.duration ?? 24;
            if (acc + dur <= totalMinutes) {
                list.push(ep);
                acc += dur;
            } else break;
        }
        return list;
    }
};
