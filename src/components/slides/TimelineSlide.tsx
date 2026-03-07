"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { timelineContainer, staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";

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
            targetLaunchDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
                    <motion.p
                        className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info mb-2"
                        variants={slideUpItem(disableAnimation)}
                    >
                        Timeline
                    </motion.p>
                    <motion.h2
                        className="font-bold text-text-primary text-slide-title"
                        variants={slideUpItem(disableAnimation)}
                    >
                        {slide.title}
                    </motion.h2>
                </div>

                {/* Scrollable Timeline Content */}
                <div className="flex-1 w-full overflow-y-auto relative z-10 px-8 pb-32">
                    <div className="relative w-full max-w-4xl mx-auto py-8">
                        {/* The Spine */}
                        {milestones.length > 0 && (
                            <motion.div
                                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 origin-top rounded-full"
                                style={{
                                    width: "3px",
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
                                                    m.state === "done" ? "bg-accent-success border-2 border-surface-page" :
                                                        m.state === "current" ? "bg-accent-info border-4 border-surface-page shadow-md" :
                                                            "bg-surface-page border-[3px] border-border-muted"
                                                )}
                                                style={{
                                                    width: "clamp(24px, 2.5vw, 32px)",
                                                    height: "clamp(24px, 2.5vw, 32px)",
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
                                                flex flex-col gap-3 w-full max-w-xl transition-all duration-300 rounded-card p-card shadow-xl border border-card
                                                ${isLeft ? "border-r-accent" : "border-l-accent"}
                                                ${isLeft ? (m.state === "done" ? "border-r-accent-success" : m.state === "current" ? "border-r-accent-info" : "border-r-border-muted") : (m.state === "done" ? "border-l-accent-success" : m.state === "current" ? "border-l-accent-info" : "border-l-border-muted")}
                                                ${m.state === "current" ? "bg-surface-primary" : m.state === "upcoming" ? "bg-surface-muted opacity-80" : "bg-surface-secondary"}
                                            `}>
                                                    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 mb-1 ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                                                        <h3 className={`font-bold text-card-title leading-tight ${m.state === "current" ? "text-text-on-emphasis" : m.state === "upcoming" ? "text-text-secondary" : "text-text-primary"}`}>{m.label}</h3>
                                                        <div className={`flex flex-wrap items-center gap-2 ${isLeft ? "justify-end" : "justify-start"}`}>
                                                            {m.state === "current" && (
                                                                <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded tracking-wider shrink-0 w-fit bg-accent-info text-white shadow-sm ring-1 ring-white/20">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                    In Progress
                                                                </div>
                                                            )}
                                                            {m.date && (
                                                                <span className={`px-2 py-0.5 text-badge font-bold uppercase rounded-badge tracking-wider shrink-0 w-fit ${m.state === "current" ? "bg-white/20 text-white" : "bg-border-muted text-text-primary"
                                                                    }`}>
                                                                    {m.date}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {m.detail && (
                                                        <p className={`text-card-body leading-relaxed ${m.state === "current" ? "text-text-on-emphasis opacity-90" : "text-text-secondary"}`}>{m.detail}</p>
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
                                                        <h3 className={cn(
                                                            "font-bold text-card-title leading-tight",
                                                            m.state === "upcoming" ? "text-text-secondary" : "text-text-primary"
                                                        )}>{m.label}</h3>

                                                        {m.state === "current" && (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded tracking-wider bg-accent-info/10 text-accent-info border border-accent-info/20 ml-1">
                                                                Currently Active
                                                            </span>
                                                        )}
                                                    </div>

                                                    {m.date && (
                                                        <p className="text-text-secondary font-semibold text-caption uppercase tracking-wider">
                                                            {m.date}
                                                        </p>
                                                    )}
                                                    {m.detail && (
                                                        <p className="text-card-body text-text-secondary leading-relaxed mt-1 line-clamp-2">{m.detail}</p>
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
                            <span className="text-badge uppercase tracking-[0.1em] text-text-muted font-semibold">Overall Progress</span>
                            <span className="text-text-primary font-bold">{Math.round(overallProgress)}%</span>
                        </div>
                        <div className="w-full bg-surface-muted border border-border-default/50 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                className="bg-accent-progress h-full rounded-full"
                                style={{ width: `${overallProgress}%` }}
                                initial={{ width: disableAnimation ? `${overallProgress}%` : 0 }}
                                animate={{ width: `${overallProgress}%` }}
                                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-16 justify-end flex-1">
                        <div className="flex flex-col items-center">
                            <span className="text-badge uppercase tracking-[0.1em] text-text-muted font-semibold mb-0.5">Milestones</span>
                            <span className="text-text-primary font-bold text-lg">{doneCount} <span className="text-text-muted font-medium opacity-50 px-1">/</span> {totalCount}</span>
                        </div>

                        <div className="flex flex-col items-center min-w-[120px]">
                            <span className="text-badge uppercase tracking-[0.1em] text-text-muted font-semibold mb-0.5">Target</span>
                            <span className="text-text-primary font-bold text-lg">{targetLaunchDate}</span>
                        </div>
                    </div>
                </motion.div>
            </LayoutWhite>
        </motion.div>
    );
}
