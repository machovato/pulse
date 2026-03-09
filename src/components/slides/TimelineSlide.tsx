"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { timelineContainer, staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";
import { Typography } from "../ui/Typography";

interface Milestone {
    label: string;
    date?: string;
    state: "done" | "current" | "upcoming";
    detail?: string;
}

interface TimelineData {
    milestones: Milestone[];
}

export function TimelineSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { milestones: [] }) as unknown as TimelineData;
    const milestones = data.milestones ?? [];

    const isStrategy = template === "strategy";

    const doneCount = milestones.filter(m => m.state === "done").length;
    const totalCount = milestones.length;
    const overallProgress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

    let targetLaunchDate = "TBD";
    const lastMilestone = milestones[milestones.length - 1];
    if (lastMilestone?.date) {
        const d = new Date(lastMilestone.date + "T00:00:00");
        if (!isNaN(d.getTime())) {
            targetLaunchDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
        } else {
            targetLaunchDate = lastMilestone.date;
        }
    }

    const spineVariant = {
        hidden: { scaleY: disableAnimation ? 1 : 0, opacity: disableAnimation ? 1 : 0 },
        visible: { scaleY: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const markerVariant = {
        hidden: { opacity: disableAnimation ? 1 : 0, scale: disableAnimation ? 1 : 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
    };

    const contentVariant = (isLeft: boolean) => ({
        hidden: disableAnimation ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -20 : 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }
    });

    const statBarVariant = {
        hidden: disableAnimation ? { y: 0 } : { y: "100%" },
        visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            className="w-full h-full"
            variants={timelineContainer(disableAnimation)}
            initial="hidden"
            animate="visible"
        >
            <LayoutWhite center={false}>
                {/* Slide Eyebrow and Title */}
                <div className="shrink-0 text-center pt-10 pb-6 w-full relative z-10">
                    <motion.div variants={slideUpItem(disableAnimation)}>
                        <Typography variant="eyebrow" className="text-accent-info mb-2">
                            Timeline
                        </Typography>
                    </motion.div>
                    <motion.div variants={slideUpItem(disableAnimation)}>
                        <Typography as="h2" variant="h1">
                            {slide.title}
                        </Typography>
                    </motion.div>
                </div>

                {/* Scrollable Timeline Content */}
                <div className="flex-1 w-full overflow-y-auto relative z-10 px-8 pb-32">
                    <div className="relative w-full max-w-4xl mx-auto py-8">
                        {/* The Spine */}
                        {milestones.length > 0 && (
                            <motion.div
                                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 origin-top rounded-full"
                                style={{
                                    width: "8px",
                                    background: "var(--accent-info)",
                                    zIndex: 0
                                }}
                                variants={spineVariant}
                            />
                        )}

                        {/* Milestones */}
                        <div className="flex flex-col gap-8 w-full">
                            {milestones.map((m, i) => {
                                const isLeft = i % 2 === 0;

                                let pctValue = 65;
                                if (m.detail) {
                                    const match = m.detail.match(/(\d+)%/);
                                    if (match) pctValue = parseInt(match[1], 10);
                                    const fracMatch = m.detail.match(/(\d+(?:\.\d+)?)\s*(?:of|\/)\s*(\d+(?:\.\d+)?)/i);
                                    if (fracMatch) {
                                        const num = parseFloat(fracMatch[1]);
                                        const den = parseFloat(fracMatch[2]);
                                        if (den > 0) pctValue = Math.min(100, Math.max(0, (num / den) * 100));
                                    }
                                }

                                return (
                                    <motion.div
                                        key={i}
                                        className="relative flex items-center w-full min-h-[100px]"
                                        variants={staggerContainer(disableAnimation)}
                                    >
                                        {/* Milestone Marker - DTN Concentric Rings */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
                                            <motion.div
                                                className={cn(
                                                    "rounded-full flex items-center justify-center relative shadow-sm",
                                                    m.state === "current" && "pulse-ring-active",
                                                    m.state === "done" ? "bg-accent-success border-[3px] border-surface-page" :
                                                        m.state === "current" ? "bg-accent-info border-[5px] border-surface-page shadow-md" :
                                                            "bg-surface-page border-[4px] border-border-muted"
                                                )}
                                                style={{
                                                    width: "clamp(32px, 3.5vw, 48px)",
                                                    height: "clamp(32px, 3.5vw, 48px)",
                                                }}
                                                variants={markerVariant}
                                            >
                                                {m.state === "done" && <Check className="w-2/3 h-2/3 text-white" strokeWidth={3.5} />}
                                                {m.state === "current" && (
                                                    <div className="w-1/2 h-1/2 bg-surface-page rounded-full absolute" />
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Content Wrapper */}
                                        <motion.div
                                            className={`w-[calc(50%-2rem)] flex flex-col justify-center ${isLeft ? "items-end text-right" : "items-start text-left ml-auto"
                                                }`}
                                            variants={contentVariant(isLeft)}
                                        >
                                            {isStrategy ? (
                                                /* Strategy Card Layout */
                                                <div className={`
                                                flex flex-col gap-3 w-full max-w-2xl transition-all duration-300 rounded-card p-card shadow-xl border border-card
                                                ${isLeft ? "border-r-accent" : "border-l-accent"}
                                                ${isLeft ? (m.state === "done" ? "border-r-accent-success" : m.state === "current" ? "border-r-accent-info" : "border-r-border-muted") : (m.state === "done" ? "border-l-accent-success" : m.state === "current" ? "border-l-accent-info" : "border-l-border-muted")}
                                                ${m.state === "current" ? "bg-surface-primary dark-surface" : m.state === "upcoming" ? "bg-surface-muted opacity-80" : "bg-surface-secondary"}
                                            `}>
                                                    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 mb-1 ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                                                        <Typography as="h3" variant="h2" className={cn("leading-tight", m.state === "upcoming" ? "text-text-secondary" : "text-text-primary")}>
                                                            {m.label}
                                                        </Typography>
                                                        <div className={`flex flex-wrap items-center gap-2 ${isLeft ? "justify-end" : "justify-start"}`}>
                                                            {m.state === "current" && (
                                                                <Typography variant="badge" className="flex items-center gap-1.5 px-2.5 py-1 bg-accent-info text-white shadow-sm ring-1 ring-white/20">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                    In Progress
                                                                </Typography>
                                                            )}
                                                            {m.date && (
                                                                <Typography variant="badge" className={cn("px-2 py-0.5 shrink-0 w-fit", m.state === "current" ? "bg-white/20 text-white" : "bg-border-muted text-text-primary")}>
                                                                    {m.date}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {m.detail && (
                                                        <Typography variant="body" className={cn("leading-relaxed", m.state === "upcoming" ? "text-text-secondary" : "text-text-primary/90")}>
                                                            {m.detail}
                                                        </Typography>
                                                    )}
                                                    {m.state === "current" && m.detail && (
                                                        <div className="w-full mt-3">
                                                            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden shadow-inner">
                                                                <motion.div
                                                                    className="h-full bg-accent-success rounded-full"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${pctValue}%` }}
                                                                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* Status Inline Layout (Restoration) */
                                                <div className={`flex flex-col gap-1.5 w-full max-w-xl transition-all`}>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Typography as="h3" variant="h2" className={cn(
                                                            "leading-tight",
                                                            m.state === "upcoming" ? "text-text-secondary" : "text-text-primary"
                                                        )}>
                                                            {m.label}
                                                        </Typography>

                                                        {m.state === "current" && (
                                                            <Typography variant="badge" className="px-2 py-0.5 bg-accent-info/10 text-accent-info border border-accent-info/20 ml-1">
                                                                Currently Active
                                                            </Typography>
                                                        )}
                                                    </div>

                                                    {m.date && (
                                                        <Typography variant="caption" className="text-text-secondary font-semibold uppercase tracking-wider">
                                                            {m.date}
                                                        </Typography>
                                                    )}
                                                    {m.detail && (
                                                        <Typography variant="body" className="text-text-secondary leading-relaxed mt-1 line-clamp-2">
                                                            {m.detail}
                                                        </Typography>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Fixed Stat Bar - Absolute bottom */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 w-full bg-surface-muted border-t border-border-muted py-6 px-16 flex items-center justify-between z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
                    variants={statBarVariant}
                >
                    <div className="flex-1 max-w-xs">
                        <div className="flex justify-between items-end mb-2">
                            <Typography variant="eyebrow" className="text-text-primary opacity-80">Overall Progress</Typography>
                            <Typography variant="h2" className="text-xl leading-none text-text-secondary">{Math.round(overallProgress)}%</Typography>
                        </div>
                        <div className="w-full bg-black/10 border border-black/5 h-1.5 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                className="bg-accent-info h-full rounded-full"
                                style={{ width: `${overallProgress}%` }}
                                initial={{ width: disableAnimation ? `${overallProgress}%` : 0 }}
                                animate={{ width: `${overallProgress}%` }}
                                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-16 justify-end flex-1">
                        <div className="flex flex-col items-center">
                            <Typography variant="eyebrow" className="text-text-primary opacity-80 mb-0.5">Milestones</Typography>
                            <span className="flex items-baseline text-text-secondary"><Typography variant="h2" className="text-lg leading-none">{doneCount}</Typography> <Typography variant="caption" className="text-text-muted opacity-50 px-1">/</Typography> <Typography variant="h2" className="text-lg leading-none">{totalCount}</Typography></span>
                        </div>

                        <div className="flex flex-col items-center min-w-[120px]">
                            <Typography variant="eyebrow" className="text-text-primary opacity-80 mb-0.5">Target</Typography>
                            <Typography variant="body" className="font-bold leading-none text-text-secondary">{targetLaunchDate}</Typography>
                        </div>
                    </div>
                </motion.div>
            </LayoutWhite>
        </motion.div>
    );
}
