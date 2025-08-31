// src/app/api/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const progress = await prisma.userProgress.findMany();
        return NextResponse.json({ data: progress });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { contentType, contentId, status } = await request.json();

        const progress = await prisma.userProgress.upsert({
            where: {
                contentType_contentId: { contentType, contentId }
            },
            update: {
                status,
                watchCount: status === 'rewatched' ? { increment: 1 } : undefined,
                lastWatchedDate: new Date()
            },
            create: {
                contentType,
                contentId,
                status,
                watchCount: 1,
                firstWatchedDate: new Date(),
                lastWatchedDate: new Date()
            }
        });

        return NextResponse.json(progress);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }
}