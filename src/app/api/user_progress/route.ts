import prisma from '@/lib/prisma'

export async function GET() {
    const progress = await prisma.user_progress.findMany()
    return new Response(JSON.stringify(progress), { status: 200 })
}

export async function POST(request) {
    const data = await request.json()
    const newProgress = await prisma.user_progress.create({ data })
    return new Response(JSON.stringify(newProgress), { status: 201 })
}
