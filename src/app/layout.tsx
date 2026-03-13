import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Project Pulse",
    description: "Meeting presentation engine",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="/themes/dtn.css?v=1.1" />
                <link rel="stylesheet" href="/themes/obsidian.css?v=1.2" />
            </head>
            <body className="min-h-screen flex flex-col bg-[var(--surface-primary)]">
                {children}
            </body>
        </html>
    );
}
