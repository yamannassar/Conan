-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "isFiller" BOOLEAN NOT NULL DEFAULT false
);
