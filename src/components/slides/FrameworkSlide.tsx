"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplitPrimarySecondary } from "./layouts/LayoutSplitPrimarySecondary";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";

interface FrameworkLane {
    title: string;
    body: string;
    icon?: string;
    type: "control" | "influence" | "concern";
    rank: number;
}

interface FrameworkData {
    lanes: FrameworkLane[];
}

function getLucideIcon(name?: string, className?: string) {
    if (!name) return <CircleDot className={className || "w-5 h-5"} />;
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
    if (!IconComponent) return <CircleDot className={className || "w-5 h-5"} />;
    return <IconComponent className={className || "w-5 h-5"} />;
}

export function FrameworkSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide, deckMeta?: Record<string, string>, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { lanes: [] }) as unknown as FrameworkData;
    const lanes = data.lanes ?? [];
    const isStrategy = template === "strategy";
    const isKickoff = template === "kickoff";

    const leftNode = lanes.length > 0 ? (() => {
        const primaryLane = lanes[0];
        return (
            <motion.div
                className={cn(
                    "w-full h-full flex flex-col pt-8 px-8 pb-10 rounded-card bg-[var(--surface-primary)] border-card justify-start shadow-xl",
                    isKickoff ? "border-l-[var(--accent-template-kickoff)]" : "border-l-[var(--text-primary)] dark-surface"
                )}
                style={{
                    borderWidth: "var(--border-width-card)",
                    borderLeftWidth: "var(--border-width-accent)"
                }}
                variants={slideUpItem(disableAnimation)}
            >
                <div className="flex flex-col h-full w-full">
                    <div className="mb-8 flex justify-end items-start mt-2">
                        <div className={cn("p-3 backdrop-blur-sm rounded-xl border", isKickoff ? "bg-white border-transparent shadow-sm" : "bg-white/10 border-white/20")}>
                            {getLucideIcon(primaryLane.icon, cn("w-8 h-8", isKickoff ? "text-accent-info" : "text-white"))}
                        </div>
                    </div>
                    <Typography as="h3" variant="h1" className={cn("mb-6 leading-[1.05] drop-shadow-sm pr-4", isKickoff ? "!text-text-primary" : "text-white")}>
                        {primaryLane.title}
                    </Typography>
                    <Typography variant="subtitle" className={cn("opacity-90 max-w-xl mt-auto", isKickoff ? "text-text-secondary" : "text-white/90")}>
                        {primaryLane.body}
                    </Typography>
                </div>
            </motion.div>
        );
    })() : null;

    const rightNode = lanes.length > 1 ? (
        <>
            {lanes.slice(1).map((lane, i) => (
                <motion.div
                    key={i}
                    className="flex-1 w-full bg-surface-page text-text-primary shadow-sm flex flex-row items-center gap-5 p-card rounded-card border-card border-l-accent border-l-accent-info"
                    style={{
                        borderWidth: "var(--border-width-card)",
                        borderLeftWidth: "var(--border-width-accent)"
                    }}
                    variants={slideUpItem(disableAnimation)}
                >
                    <div className="mt-1 shrink-0 shadow-sm rounded-xl p-3 bg-surface-page border border-border-default">
                        {getLucideIcon(lane.icon, "w-8 h-8 text-accent-info")}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                            <Typography as="h4" variant="h2" className="truncate">
                                {lane.title}
                            </Typography>
                        </div>
                        <Typography variant="body" className="line-clamp-3">
                            {lane.body}
                        </Typography>
                    </div>
                </motion.div>
            ))}
        </>
    ) : null;

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutSplitPrimarySecondary
                eyebrow={<SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="text-accent-info mb-2 opacity-60" />}
                title={slide.title}
                leftNode={leftNode}
                rightNode={rightNode}
                disableAnimation={disableAnimation}
            />
        </motion.div>
    );
}
