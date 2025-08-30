import prisma from '@/lib/prisma'

export async function GET() {
    const chapters = await prisma.manga_chapter.findMany()
    return new Response(JSON.stringify(chapters), { status: 200 })
}

export async function POST(request) {
    const data = await request.json()
    const chapter = await prisma.manga_chapter.create({ data })
    return new Response(JSON.stringify(chapter), { status: 201 })
}
