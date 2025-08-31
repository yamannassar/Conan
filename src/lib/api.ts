// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
    async getEpisodes(type: string = 'anime', params?: any) {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${API_BASE}/api/episodes?type=${type}&${searchParams}`);
        return res.json();
    },

    async getChapters(params?: any) {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${API_BASE}/api/chapters?${searchParams}`);
        return res.json();
    },

    async getMovies(params?: any) {
        const searchParams = new URLSearchParams(params);
        const res = await fetch(`${API_BASE}/api/movies?${searchParams}`);
        return res.json();
    },

    async getProgress() {
        const res = await fetch(`${API_BASE}/api/progress`);
        return res.json();
    },

    async updateProgress(data: any) {
        const res = await fetch(`${API_BASE}/api/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async getStats() {
        const res = await fetch(`${API_BASE}/api/stats`);
        return res.json();
    },

    async getContent(type: string, params?: any) {
        switch(type) {
            case 'anime':
            case 'ova':
                return this.getEpisodes(type, params);
            case 'manga':
                return this.getChapters(params);
            case 'movies':
                return this.getMovies(params);
            default:
                return { data: [] };
        }
    }
};