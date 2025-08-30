import prisma from '@/lib/prisma'

export async function GET() {
    const movies = await prisma.movie.findMany()
    return new Response(JSON.stringify(movies), { status: 200 })
}

export async function POST(request) {
    const data = await request.json()
    const movie = await prisma.movie.create({ data })
    return new Response(JSON.stringify(movie), { status: 201 })
}
