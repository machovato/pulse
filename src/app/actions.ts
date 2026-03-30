"use server";

import prisma from "@/lib/db";
import { LooseDeckSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

interface PublishResult {
    success: boolean;
    id?: string;
    error?: string;
}

export async function publishDeck(raw: unknown): Promise<PublishResult> {
    // Parse with loose schema (allows unknown slide types to pass through)
    const parsed = LooseDeckSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.errors
                .map((e) => `${e.path.join(".")}: ${e.message}`)
                .join("; "),
        };
    }

    const deck = parsed.data;
    const date = new Date(deck.meta.date);

    try {
        const record = await prisma.update.create({
            data: {
                title: deck.meta.title,
                date,
                template: deck.meta.template,
                rag: deck.meta.rag ?? null,
                content_json: JSON.stringify(deck),
                source_raw: JSON.stringify(raw, null, 2),
                schema_version: deck.schemaVersion,
            },
        });

        revalidatePath("/");
        return { success: true, id: record.id };
    } catch (err) {
        console.error("Publish error:", err);
        return { success: false, error: "Database error. Check your connection." };
    }
}

export async function updateExistingDeck(id: string, raw: unknown): Promise<PublishResult> {
    const parsed = LooseDeckSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.errors
                .map((e) => `${e.path.join(".")}: ${e.message}`)
                .join("; "),
        };
    }

    const deck = parsed.data;
    const date = new Date(deck.meta.date);

    try {
        const record = await prisma.update.update({
            where: { id },
            data: {
                title: deck.meta.title,
                date,
                template: deck.meta.template,
                rag: deck.meta.rag ?? null,
                content_json: JSON.stringify(deck),
                source_raw: JSON.stringify(raw, null, 2),
                schema_version: deck.schemaVersion,
            },
        });

        revalidatePath("/");
        revalidatePath(`/deck/${id}`);
        return { success: true, id: record.id };
    } catch (err) {
        console.error("Update error:", err);
        return { success: false, error: "Database error. Check your connection." };
    }
}

export async function deleteDeck(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.update.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Delete error:", err);
        return { success: false, error: "Failed to delete deck." };
    }
}

export async function renameDeck(id: string, newTitle: string): Promise<{ success: boolean; error?: string }> {
    try {
        const record = await prisma.update.findUnique({ where: { id } });
        if (!record) return { success: false, error: "Deck not found." };

        let contentJson = record.content_json;
        try {
            const raw = JSON.parse(contentJson);
            if (raw.meta) raw.meta.title = newTitle;
            if (raw.slides && raw.slides.length > 0 && raw.slides[0].type === "hero") {
                raw.slides[0].title = newTitle;
            }
            contentJson = JSON.stringify(raw, null, 2);
        } catch (e) {
            // Best effort JSON patching
        }

        await prisma.update.update({
            where: { id },
            data: { title: newTitle, content_json: contentJson },
        });

        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Rename error:", err);
        return { success: false, error: "Failed to rename deck." };
    }
}

export async function togglePinDeck(id: string, pinned: boolean): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.update.update({
            where: { id },
            data: { pinned },
        });
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Pin error:", err);
        return { success: false, error: "Failed to pin deck." };
    }
}

export async function archiveDeck(id: string, archived: boolean): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.update.update({
            where: { id },
            data: { archived },
        });
        revalidatePath("/");
        return { success: true };
    } catch (err) {
        console.error("Archive error:", err);
        return { success: false, error: "Failed to archive deck." };
    }
}

export async function updatePost(
    id: string,
    data: { hook: string; body: string; cta: string | null; hashtags: string[] }
): Promise<{ success: boolean; error?: string }> {
    try {
        const hashtagLine = data.hashtags
            .map((t) => (t.startsWith("#") ? t : `#${t}`))
            .join(" ");
        const hookCharCount = Array.from(data.hook).length;
        const totalCharCount =
            Array.from(data.hook).length +
            Array.from(data.body).length +
            (data.cta ? Array.from(data.cta).length : 0) +
            Array.from(hashtagLine).length;

        await prisma.post.update({
            where: { id },
            data: {
                hook: data.hook,
                body: data.body,
                cta: data.cta || null,
                hashtags: JSON.stringify(data.hashtags),
                hook_char_count: hookCharCount,
                total_char_count: totalCharCount,
            },
        });

        revalidatePath("/");
        revalidatePath("/posts");
        revalidatePath(`/posts/${id}`);
        return { success: true };
    } catch (err) {
        console.error("Update post error:", err);
        return { success: false, error: "Failed to update post." };
    }
}

export async function archivePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.post.update({ where: { id }, data: { archived: true } });
        revalidatePath("/");
        revalidatePath("/posts");
        return { success: true };
    } catch (err) {
        console.error("Archive post error:", err);
        return { success: false, error: "Failed to archive post." };
    }
}

export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.post.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/posts");
        return { success: true };
    } catch (err) {
        console.error("Delete post error:", err);
        return { success: false, error: "Failed to delete post." };
    }
}
