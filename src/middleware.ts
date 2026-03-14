import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/editor", "/history"];

/** Returns true when the request comes from the local machine. */
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

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

    if (!isProtected) return NextResponse.next();

    // Localhost always gets through — no one else can reach it anyway
    if (isLocalhost(request)) return NextResponse.next();

    const adminSecret = process.env.ADMIN_SECRET;

    // No secret configured and not localhost → block (misconfigured public deploy)
    if (!adminSecret) return NextResponse.redirect(new URL("/login", request.url));


    // Check session cookie
    const sessionCookie = request.cookies.get("pulse_session")?.value;
    if (sessionCookie === adminSecret) return NextResponse.next();

    // Check Authorization header (for API/programmatic access)
    const authHeader = request.headers.get("authorization");
    if (authHeader === `Bearer ${adminSecret}`) return NextResponse.next();

    // Redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/editor/:path*", "/history/:path*"],
};
