-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "template" TEXT NOT NULL,
    "rag" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "content_json" TEXT NOT NULL,
    "source_raw" TEXT NOT NULL,
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
