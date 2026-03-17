import type { Metadata } from "next";
import "@/styles/globals.css";
import "../../public/themes/blue.css";
import "../../public/themes/obsidian.css";
import "../../public/themes/ember.css";
import "../../public/themes/tide.css";
import "../../public/themes/crimson.css";
import LocalThemeLoader from "@/components/LocalThemeLoader";

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
                <LocalThemeLoader />
            </head>
            <body className="min-h-screen flex flex-col bg-[var(--surface-primary)]">
                {children}
            </body>
        </html>
    );
}
