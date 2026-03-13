import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { PresentationClient } from "./PresentationClient";
import { LooseDeckSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props) {
    const record = await prisma.update.findUnique({ where: { id: params.id } });
    return { title: record ? `${record.title} — Project Pulse` : "Deck Not Found" };
}

export default async function DeckPage({ params }: Props) {
    const record = await prisma.update.findUnique({ where: { id: params.id } });
    if (!record) notFound();

    const parsed = LooseDeckSchema.safeParse(
        typeof record.content_json === "string"
            ? JSON.parse(record.content_json)
            : record.content_json
    );
    if (!parsed.success) {
        return (
            <div className="flex items-center justify-center h-screen bg-[var(--surface-primary)]">
                <div className="card p-10 max-w-md text-center">
                    <p className="text-lg font-bold text-[var(--text-primary)] mb-2">Deck data error</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Could not parse stored JSON for this deck. It may be from an incompatible schema version.
                    </p>
                </div>
            </div>
        );
    }

    return <PresentationClient deck={parsed.data} deckId={record.id} />;
}
