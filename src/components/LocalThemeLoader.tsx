/**
 * LocalThemeLoader — Server Component
 *
 * Injects <link> tags for private theme files that live in public/themes/
 * but are excluded from git (e.g. licensed brand themes like DTN).
 *
 * Because these files are in public/, they're served as static assets at
 * /themes/*.css — no bundler involvement needed. The server-side fs.existsSync
 * check means missing files are silently skipped (safe for public clones).
 */

import fs from "fs";
import path from "path";

const PRIVATE_THEMES = ["dtn"];

export default function LocalThemeLoader() {
    const available = PRIVATE_THEMES.filter((name) =>
        fs.existsSync(path.join(process.cwd(), "public", "themes", `${name}.css`))
    );

    if (available.length === 0) return null;

    return (
        <>
            {available.map((name) => (
                <link
                    key={name}
                    rel="stylesheet"
                    href={`/themes/${name}.css`}
                />
            ))}
        </>
    );
}
