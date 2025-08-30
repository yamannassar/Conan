import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class ConanDataService {
    async fetchFromAPI() {
        try {
            const res = await fetch('https://api.jikan.moe/v4/anime/235/episodes')
            const data = await res.json()
            return data.data
        } catch (err) {
            console.error('Failed to fetch from API:', err)
            return []
        }
    }

    async getLatestLocalEpisode() {
        return prisma.episodes.findFirst({
            orderBy: { number: 'desc' },
        })
    }

    async updateLocalDatabase(episodes) {
        for (const ep of episodes) {
            await prisma.episodes.upsert({
                where: { number: ep.episode_id },
                update: {
                    title: ep.title,
                    title_japanese: ep.title_japanese,
                    air_date: ep.aired,
                },
                create: {
                    number: ep.episode_id,
                    title: ep.title,
                    title_japanese: ep.title_japanese,
                    series_type_id: 1, // anime
                    air_date: ep.aired,
                },
            })
        }
    }

    async sync() {
        const latestOnline = await this.fetchFromAPI()
        const latestLocal = await this.getLatestLocalEpisode()
        const newEpisodes = latestOnline.filter(ep => ep.episode_id > (latestLocal?.number || 0))

        if (newEpisodes.length) {
            console.log(`Adding ${newEpisodes.length} new episodes...`)
            await this.updateLocalDatabase(newEpisodes)
        } else {
            console.log('No new episodes to add.')
        }
    }
}

const service = new ConanDataService()
service.sync().then(() => {
    console.log('Sync complete.')
    process.exit(0)
})
