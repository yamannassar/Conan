/*
  Warnings:

  - Added the required column `seriesTypeId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SeriesType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MangaChapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "volume" INTEGER,
    "title" TEXT NOT NULL,
    "titleJapanese" TEXT,
    "releaseDate" DATETIME,
    "pageCount" INTEGER,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleJapanese" TEXT,
    "releaseDate" DATETIME,
    "durationMinutes" INTEGER,
    "chronologicalPlacement" INTEGER,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentType" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "watchCount" INTEGER NOT NULL DEFAULT 0,
    "firstWatchedDate" DATETIME,
    "lastWatchedDate" DATETIME,
    "rating" INTEGER,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "ContentTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,
    CONSTRAINT "ContentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoryArc" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startEpisode" INTEGER,
    "endEpisode" INTEGER,
    "startChapter" INTEGER,
    "endChapter" INTEGER,
    "description" TEXT,
    "importanceLevel" INTEGER
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seriesTypeId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleJapanese" TEXT,
    "titleRomanized" TEXT,
    "airDate" DATETIME,
    "mangaSource" TEXT,
    "isFiller" BOOLEAN NOT NULL DEFAULT false,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "durationMinutes" INTEGER,
    CONSTRAINT "Episode_seriesTypeId_fkey" FOREIGN KEY ("seriesTypeId") REFERENCES "SeriesType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("id", "isFiller", "number", "title") SELECT "id", "isFiller", "number", "title" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE UNIQUE INDEX "Episode_seriesTypeId_number_key" ON "Episode"("seriesTypeId", "number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MangaChapter_number_key" ON "MangaChapter"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_number_key" ON "Movie"("number");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_contentType_contentId_key" ON "UserProgress"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTag_tagId_contentType_contentId_key" ON "ContentTag"("tagId", "contentType", "contentId");
