import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DeckSchema } from "@/lib/schema";

// Helper to check if request is from localhost (same logic as auth bypass)
function isLocalhost(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || req.ip || "127.0.0.1";
    const host = req.headers.get("host") || "unknown";

    return (
        ip === "127.0.0.1" || 
        ip === "::1" || 
        ip === "::ffff:127.0.0.1" || 
        ip.includes("localhost") ||
        host.includes("localhost") ||
        host.includes("127.0.0.1") ||
        host.includes("[::1]")
    );
}

export async function POST(req: NextRequest) {
    if (!isLocalhost(req)) {
        return NextResponse.json({ error: "Access denied. Localhost only." }, { status: 403 });
    }

    try {
        const body = await req.json();
        const contentJson = body.content_json;
        
        if (!contentJson) {
            return NextResponse.json({ error: "content_json is required" }, { status: 400 });
        }

        let parsedContent;
        try {
            parsedContent = JSON.parse(contentJson);
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON format in content_json" }, { status: 400 });
        }

        // Validate against Zod schema
        const validated = DeckSchema.safeParse(parsedContent);
        if (!validated.success) {
            return NextResponse.json({ 
                error: "Invalid deck schema", 
                details: validated.error.format() 
            }, { status: 400 });
        }

        const deck = validated.data;
        const meta = deck.meta || {};
        
        // Create deck record
        const newDeck = await prisma.update.create({
            data: {
                title: meta.title || "Untitled Deck",
                template: meta.template || "status",
                date: meta.date ? new Date(meta.date) : new Date(),
                content_json: contentJson,
                source_raw: "Created via MCP"
            }
        });

        const baseUrl = new URL(req.url).origin;
        return NextResponse.json({
            id: newDeck.id,
            title: newDeck.title,
            url: `${baseUrl}/deck/${newDeck.id}`
        });

    } catch (error: any) {
        console.error("[MCP] Create Deck Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    if (!isLocalhost(req)) {
        return NextResponse.json({ error: "Access denied. Localhost only." }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const template = searchParams.get("template");
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        // By default, exclude archived decks if that column existed, but we don't have it yet.
        // We will just filter by template if provided.

        const where: any = {};
        if (template) {
            where.template = template;
        }

        const decks = await prisma.update.findMany({
            where,
            orderBy: { created_at: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                template: true,
                date: true
            }
        });

        const baseUrl = new URL(req.url).origin;
        const formattedDecks = decks.map((d: any) => ({
            id: d.id,
            title: d.title,
            template: d.template,
            date: d.date.toISOString().split('T')[0],
            url: `${baseUrl}/deck/${d.id}`
        }));

        return NextResponse.json({ decks: formattedDecks });

    } catch (error: any) {
        console.error("[MCP] List Decks Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
