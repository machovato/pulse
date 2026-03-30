-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "cta" TEXT,
    "hashtags" TEXT NOT NULL DEFAULT '[]',
    "hook_char_count" INTEGER NOT NULL,
    "total_char_count" INTEGER NOT NULL,
    "voice_version" TEXT NOT NULL DEFAULT '1.0',
    "content_json" TEXT NOT NULL,
    "source_raw" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
