/**
 * Layout 3 — Full-Bleed White
 * Applied to: kpis, pipeline, timeline
 *
 * Full-viewport white. Children centred. Concentric circles at very low
 * opacity as background texture — must not compete with the data.
 */
import { ConcentricCircles } from "../ConcentricCircles";

interface LayoutWhiteProps {
    children: React.ReactNode;
    /** Center content vertically */
    center?: boolean;
    /** Optional background node to render behind the entire layout */
    backgroundNode?: React.ReactNode;
}

export function LayoutWhite({ children, center = true, backgroundNode }: LayoutWhiteProps) {
    return (
        <div className="relative w-full h-full min-h-[100vh] flex flex-col bg-surface-page text-text-secondary overflow-hidden">
            {backgroundNode}
            
            {/* Background texture — barely perceptible */}
            <ConcentricCircles
                rings={7}
                baseRadius={80}
                step={90}
                color="#1B8FE0"
                opacity={0.1}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] pointer-events-none"
            />

            {/* Content layer */}
            <div
                className={`relative z-10 w-full h-full flex flex-col flex-1 px-slide ${center ? "justify-center items-center" : ""
                    }`}
            >
                {children}
            </div>
        </div>
    );
}
