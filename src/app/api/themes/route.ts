import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const themesDir = path.join(process.cwd(), "public", "themes");
        if (!fs.existsSync(themesDir)) {
            return NextResponse.json({ themes: [] });
        }

        const files = fs.readdirSync(themesDir);
        const themes = files
            .filter((file) => file.endsWith(".css"))
            .map((file) => file.replace(".css", ""));

        return NextResponse.json({ themes });
    } catch (err) {
        console.error("Error reading themes dir:", err);
        return NextResponse.json({ themes: [] });
    }
}
