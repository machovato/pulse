import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LinkedInPostSchema } from "@/lib/schema";

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

        // Validate against LinkedInPost schema
        const validated = LinkedInPostSchema.safeParse(parsedContent);
        if (!validated.success) {
            return NextResponse.json({
                error: "Invalid linkedin_post schema",
                details: validated.error.format(),
            }, { status: 400 });
        }

        const post = validated.data;

        const newPost = await prisma.post.create({
            data: {
                project: post.project,
                pillar: post.pillar,
                theme: post.theme,
                hook: post.hook,
                body: post.body,
                cta: post.cta || null,
                hashtags: JSON.stringify(post.hashtags || []),
                hook_char_count: post.hook_char_count,
                total_char_count: post.total_char_count,
                voice_version: post.voice_version,
                content_json: contentJson,
                source_raw: "Created via MCP",
            },
        });

        const baseUrl = new URL(req.url).origin;
        return NextResponse.json({
            id: newPost.id,
            url: `${baseUrl}/posts/${newPost.id}`,
        });
    } catch (error: any) {
        console.error("[MCP] Create Post Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    if (!isLocalhost(req)) {
        return NextResponse.json({ error: "Access denied. Localhost only." }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const pillar = searchParams.get("pillar");
        const project = searchParams.get("project");
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        const where: any = {};
        if (pillar) where.pillar = pillar;
        if (project) where.project = project;

        const posts = await prisma.post.findMany({
            where,
            orderBy: { created_at: "desc" },
            take: limit,
            select: {
                id: true,
                project: true,
                pillar: true,
                theme: true,
                hook: true,
                status: true,
                created_at: true,
            },
        });

        const baseUrl = new URL(req.url).origin;
        const formattedPosts = posts.map((p: any) => ({
            id: p.id,
            project: p.project,
            pillar: p.pillar,
            theme: p.theme,
            hook: p.hook.length > 80 ? p.hook.slice(0, 80) + "…" : p.hook,
            status: p.status,
            date: p.created_at.toISOString().split("T")[0],
            url: `${baseUrl}/posts/${p.id}`,
        }));

        return NextResponse.json({ posts: formattedPosts });
    } catch (error: any) {
        console.error("[MCP] List Posts Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
