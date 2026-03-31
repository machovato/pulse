-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
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
    "platform" TEXT NOT NULL DEFAULT 'LinkedIn',
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Post" ("archived", "body", "content_json", "created_at", "cta", "hashtags", "hook", "hook_char_count", "id", "pillar", "project", "source_raw", "status", "theme", "total_char_count", "voice_version") SELECT "archived", "body", "content_json", "created_at", "cta", "hashtags", "hook", "hook_char_count", "id", "pillar", "project", "source_raw", "status", "theme", "total_char_count", "voice_version" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
