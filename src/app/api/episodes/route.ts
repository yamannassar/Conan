// /src/app/api/episodes/route.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class ConanDataService {
    async fetchLatestEpisodes() {
        try {
            // لو حابة تجيبي الحلقات من Jikan API
            // const response = await fetch('https://api.jikan.moe/v4/anime/235/episodes')
            // const data = await response.json()
            // return data.data

            // إذا فشل، ارجع الحلقات من قاعدة البيانات المحلية
            return await prisma.episode.findMany({
                orderBy: { number: 'asc' },
            })
        } catch (error) {
            console.error(error)
            return []
        }
    }
}

const service = new ConanDataService()

export async function GET() {
    const episodes = await service.fetchLatestEpisodes()
    return new Response(JSON.stringify(episodes), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
}
