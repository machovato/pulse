import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "DTN Project Pulse",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Top nav */}
            <nav className="bg-white border-b border-[var(--card-border)] sticky top-0 z-50 no-print" style={{ boxShadow: "0 1px 4px rgba(13,34,64,0.06)" }}>
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[var(--dtn-navy)] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            P
                        </div>
                        <span className="font-bold text-[var(--dtn-navy)] text-base">Project Pulse</span>
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-1">
                        <NavLink href="/editor">Editor</NavLink>
                        <NavLink href="/history">History</NavLink>
                        <NavLink href="/schema">Schema</NavLink>
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[var(--dtn-blue)] no-print" style={{ minHeight: "40px" }}>
                <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-end">
                    <span className="text-white text-xs font-medium opacity-80">
                        {process.env.NEXT_PUBLIC_APP_VERSION} • DTN · Proprietary and Confidential
                    </span>
                </div>
            </footer>
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="relative px-4 py-2 text-sm font-medium text-[var(--dtn-muted)] hover:text-[var(--dtn-navy)] transition-colors rounded-md hover:bg-gray-50 group"
        >
            {children}
        </Link>
    );
}
