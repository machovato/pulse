/**
 * Layout 2 — Split Panel (40% brand left / 60% content right)
 * Applied to: callout, blockers, agenda, decision_log, grid
 *
 * Left panel: DTN Blue gradient (or Navy override for low-urgency blockers).
 * Concentric circles centred on the seam (spans both panels).
 * Right panel: white (#FFFFFF), generous padding, content lives here.
 */
import { ConcentricCircles } from "../ConcentricCircles";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";

interface LayoutSplitProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    /** Override left panel background. Defaults to DTN Blue gradient. */
    leftBackground?: "blue" | "navy";
    /** Override padding for the right panel. Defaults to true (px-12 py-10). */
    rightPadding?: boolean;
    /** Override background for the right panel. Defaults to white. */
    rightBg?: string;
    /** Alignment of the left panel content. Defaults to "center". */
    leftAlign?: "center" | "start";
    /** Padding classes for the left panel. Defaults to "px-10". */
    leftPadding?: string;
}

const BACKGROUNDS = {
    blue: "var(--surface-split)",
    navy: "var(--surface-split-alt)",
};

export function LayoutSplit({
    leftContent,
    rightContent,
    leftBackground = "blue",
    rightPadding = true,
    rightBg = "bg-white",
    leftAlign = "center",
    leftPadding = "px-10",
}: LayoutSplitProps) {
    const { template } = useTemplate();
    const isKickoff = template === "kickoff";
    return (
        <div className="relative w-full h-full flex overflow-hidden">
            {/* LEFT PANEL — 40% */}
            <div
                className={cn(
                    "relative flex flex-col overflow-hidden",
                    leftAlign === "start" ? "justify-start py-12" : "justify-center",
                    leftPadding,
                    !isKickoff && "dark-surface"
                )}
                style={{
                    width: "40%",
                    flexShrink: 0,
                    background: BACKGROUNDS[leftBackground],
                }}
            >
                <div className="relative z-10">{leftContent}</div>
            </div>

            {/* CONCENTRIC CIRCLES — centred on the seam, overflow visible */}
            <div
                className="absolute top-1/2 pointer-events-none z-20"
                style={{
                    left: "40%",
                    transform: "translate(-50%, -50%)",
                    width: "55%",
                    maxWidth: "640px",
                    aspectRatio: "1 / 1",
                }}
            >
                <ConcentricCircles
                    rings={8}
                    baseRadius={50}
                    step={55}
                    color="white"
                    opacity={0.15}
                    className="w-full h-full"
                />
            </div>

            {/* Faint circles on right panel too — very low opacity for texture */}
            <div
                className="absolute bottom-0 right-0 pointer-events-none z-0 opacity-30"
                style={{
                    width: "35%",
                    aspectRatio: "1 / 1",
                    transform: "translate(30%, 30%)",
                }}
            >
                <ConcentricCircles
                    rings={6}
                    baseRadius={40}
                    step={45}
                    color="#1B8FE0"
                    opacity={0.08}
                    className="w-full h-full"
                />
            </div>

            {/* RIGHT PANEL — 60% */}
            <div
                className={`relative z-10 flex flex-col justify-center h-full overflow-auto ${rightBg} ${rightPadding ? 'px-slide py-10' : ''}`}
                style={{ width: "60%", flexShrink: 0 }}
            >
                {rightContent}
            </div>
        </div>
    );
}
