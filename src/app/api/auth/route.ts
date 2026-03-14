import { NextRequest, NextResponse } from "next/server";

function isLocalhost(request: NextRequest): boolean {
    const host = request.headers.get("host") ?? "";
    const forwarded = request.headers.get("x-forwarded-for") ?? "";
    return (
        host.startsWith("localhost") ||
        host.startsWith("127.0.0.1") ||
        host.startsWith("[::1]") ||
        forwarded === "127.0.0.1" ||
        forwarded === "::1"
    );
}

export async function POST(req: NextRequest) {
    // Localhost always gets through — no password needed for local use
    if (isLocalhost(req)) {
        const response = NextResponse.json({ ok: true });
        response.cookies.set("pulse_session", "__localhost__", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
        });
        return response;
    }

    const { secret } = await req.json();
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret || secret !== adminSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("pulse_session", adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
    return response;
}
