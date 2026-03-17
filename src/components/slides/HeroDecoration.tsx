"use client";

type DecorationVariant = "circles" | "squares" | "triangles" | "lines";

interface HeroDecorationProps {
    variant?: DecorationVariant;
    color?: string;
    opacity?: number;
    className?: string;
}

/** Concentric circles — existing motif, used by status/standup/default */
function Circles({ rings = 9, baseRadius = 80, step = 80, color = "white", opacity = 0.9 }: {
    rings?: number; baseRadius?: number; step?: number; color?: string; opacity?: number;
}) {
    const radii = Array.from({ length: rings }, (_, i) => baseRadius + i * step);
    const maxR = radii[radii.length - 1];
    const viewSize = maxR * 2 + 4;
    return (
        <svg
            viewBox={`${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
        >
            {radii.map((r, i) => (
                <circle
                    key={r}
                    cx={0} cy={0} r={r}
                    stroke={color}
                    strokeWidth={2}
                    opacity={((rings - i) / rings) * 0.26 * opacity}
                />
            ))}
        </svg>
    );
}

/** Concentric squares rotated 45° — diamond motif for strategy/crimson */
function Squares({ rings = 9, baseSize = 80, step = 80, color = "white", opacity = 0.9 }: {
    rings?: number; baseSize?: number; step?: number; color?: string; opacity?: number;
}) {
    const sizes = Array.from({ length: rings }, (_, i) => baseSize + i * step);
    const maxS = sizes[sizes.length - 1];
    const viewSize = maxS * Math.SQRT2 + 4;
    return (
        <svg
            viewBox={`${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
        >
            {sizes.map((s, i) => {
                const half = s / 2;
                // Rotated square as polygon: top, right, bottom, left
                const points = `0,${-half} ${half},0 0,${half} ${-half},0`;
                return (
                    <polygon
                        key={s}
                        points={points}
                        stroke={color}
                        strokeWidth={2}
                        opacity={((rings - i) / rings) * 0.26 * opacity}
                    />
                );
            })}
        </svg>
    );
}

/** Stacked upward triangles — launch/momentum motif for kickoff */
function Triangles({ count = 8, baseSize = 100, step = 70, color = "white", opacity = 0.9 }: {
    count?: number; baseSize?: number; step?: number; color?: string; opacity?: number;
}) {
    const sizes = Array.from({ length: count }, (_, i) => baseSize + i * step);
    const maxS = sizes[sizes.length - 1];
    const viewSize = maxS + 4;
    return (
        <svg
            viewBox={`${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
        >
            {sizes.map((s, i) => {
                const half = s / 2;
                const h = (s * Math.sqrt(3)) / 2; // equilateral triangle height
                // Points: apex at top, base at bottom
                const points = `0,${-h / 2} ${half},${h / 2} ${-half},${h / 2}`;
                return (
                    <polygon
                        key={s}
                        points={points}
                        stroke={color}
                        strokeWidth={2}
                        opacity={((count - i) / count) * 0.26 * opacity}
                    />
                );
            })}
        </svg>
    );
}

/** Diagonal 45° lines — energy/momentum motif for standup/tide */
function Lines({ spacing = 52, color = "white", opacity = 0.9 }: {
    spacing?: number; color?: string; opacity?: number;
}) {
    const size = 800;
    // For 45° lines the perpendicular gap = spacing, so offset step = spacing * √2
    const step = Math.round(spacing * Math.SQRT2);
    const offsets: number[] = [];
    for (let k = -size + step; k < size; k += step) {
        offsets.push(k);
    }
    const total = offsets.length;
    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ width: "100%", height: "100%" }}
        >
            {offsets.map((k, i) => {
                // Sine-bell fade — brightest in the middle of the range
                const t = total > 1 ? i / (total - 1) : 0.5;
                const lineOpacity = (0.07 + 0.16 * Math.sin(Math.PI * t)) * opacity;
                return (
                    <line
                        key={k}
                        x1={k}        y1={size}   /* bottom-left origin */
                        x2={k + size} y2={0}       /* top-right — "/" direction */
                        stroke={color}
                        strokeWidth={2.5}
                        opacity={lineOpacity}
                    />
                );
            })}
        </svg>
    );
}

/**
 * HeroDecoration — template-driven geometric motif for hero slide backgrounds.
 * 
 * Variants:
 *   circles   → concentric rings (status, standup, allHands)
 *   squares   → concentric diamonds (strategy, crimson)
 *   triangles → stacked upward triangles (kickoff)
 *   lines     → horizontal ripples (tide, custom)
 */
export function HeroDecoration({
    variant = "circles",
    color = "white",
    opacity = 0.9,
    className = "",
}: HeroDecorationProps) {
    const shared = { color, opacity };
    return (
        <div className={className} aria-hidden="true">
            {variant === "circles"   && <Circles   {...shared} />}
            {variant === "squares"   && <Squares   {...shared} />}
            {variant === "triangles" && <Triangles {...shared} />}
            {variant === "lines"     && <Lines     {...shared} />}
        </div>
    );
}

/** Maps template names to their decoration variant */
export const TEMPLATE_DECORATION: Record<string, "circles" | "squares" | "triangles" | "lines"> = {
    status:       "circles",
    standup:      "lines",
    allHands:     "circles",
    requirements: "circles",
    strategy:     "squares",
    kickoff:      "triangles",
    custom:       "lines",
};
