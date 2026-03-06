/**
 * Layout 1 — Full-Bleed Brand
 * Applied to: hero
 *
 * Full-viewport DTN Blue gradient. Concentric circle motif upper-right at low opacity.
 * Children rendered over the gradient.
 */
import { ConcentricCircles } from "../ConcentricCircles";

interface LayoutBrandProps {
    children: React.ReactNode;
}

export function LayoutBrand({ children }: LayoutBrandProps) {
    return (
        <div
            className="relative w-full h-full overflow-hidden"
            style={{ background: "var(--surface-hero)" }}
        >
            {/* Concentric circles — upper right, large and subtle */}
            <ConcentricCircles
                rings={9}
                baseRadius={80}
                step={80}
                color="white"
                opacity={0.9}
                className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] pointer-events-none"
            />

            {/* Content layer */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>
        </div>
    );
}
