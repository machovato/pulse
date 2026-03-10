import { motion } from "framer-motion";
import { slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./LayoutWhite";
import { Typography } from "../../ui/Typography";

interface LayoutSplitPrimarySecondaryProps {
    eyebrow: string;
    title: React.ReactNode;
    leftNode: React.ReactNode;
    rightNode: React.ReactNode;
    backgroundNode?: React.ReactNode;
    disableAnimation?: boolean;
}

/**
 * Standardized Primary/Secondary Column Format
 * Provides a unified wrapper mirroring the Problem Slide's 50/50 split structure.
 */
export function LayoutSplitPrimarySecondary({
    eyebrow,
    title,
    leftNode,
    rightNode,
    backgroundNode,
    disableAnimation = false,
}: LayoutSplitPrimarySecondaryProps) {
    return (
        <LayoutWhite center={false}>
            {backgroundNode}
            <div className="w-full flex-1 flex flex-col justify-start py-12 px-slide relative z-10">
                <motion.div className="mb-8 shrink-0" variants={slideUpItem(disableAnimation)}>
                    <Typography variant="eyebrow" className="text-accent-info mb-2 opacity-60">
                        {eyebrow}
                    </Typography>
                    <Typography as="h2" variant="h1" className="leading-tight mt-0 pt-0">
                        {title}
                    </Typography>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8 w-full mt-4 flex-1">
                    {/* Left Hand Zone */}
                    <div className="w-full md:w-1/2 flex flex-col h-full">
                        {leftNode}
                    </div>

                    {/* Right Hand Zone */}
                    <div className="w-full md:w-1/2 flex flex-col h-full justify-between gap-4">
                        {rightNode}
                    </div>
                </div>
            </div>
        </LayoutWhite>
    );
}
