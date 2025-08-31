// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const [totalEpisodes, totalChapters, totalMovies, totalOVAs, progress] = await Promise.all([
            prisma.episode.count({ where: { type: 'anime' } }),
            prisma.mangaChapter.count(),
            prisma.movie.count(),
            prisma.episode.count({ where: { type: 'ova' } }),
            prisma.userProgress.findMany()
        ]);

        const watchedEpisodes = progress.filter(p =>
            p.contentType === 'episode' && ['watched', 'rewatched'].includes(p.status)
        ).length;

        const readChapters = progress.filter(p =>
            p.contentType === 'chapter' && ['watched', 'rewatched'].includes(p.status)
        ).length;

        const watchedMovies = progress.filter(p =>
            p.contentType === 'movie' && ['watched', 'rewatched'].includes(p.status)
        ).length;

        const watchedOVAs = progress.filter(p =>
            p.contentType === 'ova' && ['watched', 'rewatched'].includes(p.status)
        ).length;

        return NextResponse.json({
            episodes: {
                total: totalEpisodes,
                watched: watchedEpisodes,
                percentage: totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0
            },
            chapters: {
                total: totalChapters,
                read: readChapters,
                percentage: totalChapters > 0 ? (readChapters / totalChapters) * 100 : 0
            },
            movies: {
                total: totalMovies,
                watched: watchedMovies,
                percentage: totalMovies > 0 ? (watchedMovies / totalMovies) * 100 : 0
            },
            ovas: {
                total: totalOVAs,
                watched: watchedOVAs,
                percentage: totalOVAs > 0 ? (watchedOVAs / totalOVAs) * 100 : 0
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}