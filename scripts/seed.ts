// scripts/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.userProgress.deleteMany();
    await prisma.contentTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.mangaChapter.deleteMany();
    await prisma.episode.deleteMany();
    await prisma.storyArc.deleteMany();

    // Create sample episodes
    await prisma.episode.createMany({
        data: [
            { number: 1, title: "Roller Coaster Murder Case", type: "anime", isFiller: false, isImportant: true },
            { number: 2, title: "Company President's Daughter Kidnapping Case", type: "anime", isFiller: false },
            { number: 1001, title: "Conan vs. Kid vs. Yaiba", type: "ova" },
            // Add more...
        ]
    });

    // Create sample chapters
    await prisma.mangaChapter.createMany({
        data: [
            { number: 1, title: "The Heisei Holmes", volume: 1, isImportant: true },
            { number: 2, title: "The Shrunk Detective", volume: 1 },
            // Add more...
        ]
    });

    // Create sample movies
    await prisma.movie.createMany({
        data: [
            { number: 1, title: "The Time-Bombed Skyscraper", duration: 94 },
            { number: 2, title: "The Fourteenth Target", duration: 99 },
            // Add more...
        ]
    });

    console.log('✅ Database seeded successfully');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());