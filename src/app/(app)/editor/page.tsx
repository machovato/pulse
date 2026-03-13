import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorClient } from "./EditorClient";
import prisma from "@/lib/db";

export const metadata: Metadata = {
    title: "Editor — Project Pulse",
    description: "Create and publish presentation decks",
};

interface Props {
    searchParams: { editId?: string };
}

export default async function EditorPage({ searchParams }: Props) {
    let editJson: string | undefined = undefined;
    if (searchParams.editId) {
        const record = await prisma.update.findUnique({ where: { id: searchParams.editId } });
        if (record) editJson = record.content_json;
    }

    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400 text-sm">Loading editor…</div>}>
            <EditorClient existingJson={editJson} editId={searchParams.editId} />
        </Suspense>
    );
}
