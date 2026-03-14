"use client";

interface ConcentricCirclesProps {
    /**  Number of rings */
    rings?: number;
    /** Base radius for innermost ring (in SVG units) */
    baseRadius?: number;
    /** Gap between rings */
    step?: number;
    /** Stroke color (e.g. "white" or "#003057") */
    color?: string;
    /** Overall opacity multiplier */
    opacity?: number;
    /** CSS className for the <svg> element */
    className?: string;
}

/**
 * Concentric circle motif — pure inline SVG, zero external assets.
 * The SVG is centred at (0,0) so it can be positioned freely via CSS.
 */
export function ConcentricCircles({
    rings = 8,
    baseRadius = 60,
    step = 60,
    color = "white",
    opacity = 1,
    className = "",
}: ConcentricCirclesProps) {
    const radii = Array.from({ length: rings }, (_, i) => baseRadius + i * step);
    const maxR = radii[radii.length - 1];
    const viewSize = maxR * 2 + 4; // tight bounding box

    return (
        <svg
            viewBox={`${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            {radii.map((r, i) => {
                // Outer rings are more transparent
                const ringOpacity = ((rings - i) / rings) * 0.18 * opacity;
                return (
                    <circle
                        key={r}
                        cx={0}
                        cy={0}
                        r={r}
                        stroke={color}
                        strokeWidth={1.5}
                        opacity={ringOpacity}
                    />
                );
            })}
        </svg>
    );
}
