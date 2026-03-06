"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";

interface Milestone {
    label: string;
    date?: string;
    state: "done" | "current" | "upcoming";
    detail?: string;
}

interface TimelineData {
    milestones: Milestone[];
}

export function TimelineSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? { milestones: [] }) as unknown as TimelineData;
    const milestones = data.milestones ?? [];

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

    return (
        <LayoutWhite center={false}>
            {/* Slide Eyebrow and Title */}
            <div className="shrink-0 text-center pt-10 pb-6 w-full relative z-10">
                <motion.p
                    className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-info mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    Timeline
                </motion.p>
                <motion.h2
                    className="font-bold text-text-primary"
                    style={{ fontSize: "clamp(28px, 3.2vw, 48px)" }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.06 }}
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
                            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 origin-top rounded-full shadow-inner"
                            style={{ background: "linear-gradient(to bottom, var(--accent-info), var(--accent-success))", zIndex: 0 }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
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
                                    className="relative flex items-center w-full min-h-[120px]"
                                >
                                    {/* Milestone Dot */}
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
                                        <motion.div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center relative shadow-md border-4 border-surface-page ${m.state === "done" ? "bg-accent-success" :
                                                m.state === "current" ? "bg-accent-info pulse-ring-active" :
                                                    "bg-surface-muted border-border-muted"
                                                }`}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                                        >
                                            {m.state === "done" && <Check className="w-6 h-6 text-white" strokeWidth={3} />}
                                            {m.state === "current" && <div className="w-3 h-3 bg-white rounded-full" />}
                                        </motion.div>
                                    </div>

                                    {/* Milestone Card Container */}
                                    <motion.div
                                        className={`w-[calc(50%-3.5rem)] flex flex-col justify-center ${isLeft ? "items-end text-right" : "items-start text-left ml-auto"
                                            }`}
                                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                                    >
                                        <div className={`
                                            flex flex-col gap-3 w-full max-w-xl transition-all duration-300 rounded-2xl p-6 md:p-8 shadow-xl border border-border-default
                                            ${isLeft ? "border-r-[8px]" : "border-l-[8px]"}
                                            ${isLeft ? (m.state === "done" ? "border-r-accent-success" : m.state === "current" ? "border-r-accent-info" : "border-r-border-muted") : (m.state === "done" ? "border-l-accent-success" : m.state === "current" ? "border-l-accent-info" : "border-l-border-muted")}
                                            ${m.state === "current" ? "bg-surface-primary" : m.state === "upcoming" ? "bg-surface-muted opacity-80" : "bg-surface-secondary"}
                                        `}>
                                            <div className={`flex flex-col sm:flex-row sm:items-center gap-3 mb-1 ${isLeft ? "sm:flex-row-reverse" : ""}`}>
                                                <h3 className={`font-bold text-2xl md:text-3xl leading-tight ${m.state === "current" ? "text-text-on-emphasis" : "text-text-primary"}`}>{m.label}</h3>
                                                <div className={`flex flex-wrap gap-2 ${isLeft ? "justify-end" : "justify-start"}`}>
                                                    {m.state === "current" && (
                                                        <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded tracking-wider shrink-0 w-fit bg-accent-info text-white shadow-sm">
                                                            You Are Here
                                                        </span>
                                                    )}
                                                    {m.date && (
                                                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded tracking-wider shrink-0 w-fit ${m.state === "current" ? "bg-white/20 text-white" : "bg-border-muted text-text-primary"
                                                            }`}>
                                                            {m.date}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {m.detail && (
                                                <p className={`text-lg leading-relaxed ${m.state === "current" ? "text-text-on-emphasis opacity-90" : "text-text-secondary"}`}>{m.detail}</p>
                                            )}

                                            {m.state === "current" && m.detail && (
                                                <div className="w-full mt-3">
                                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
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
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                <div className="flex-1 max-w-xs">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[12px] uppercase tracking-[0.1em] text-text-muted font-semibold">Overall Progress</span>
                        <span className="text-text-primary font-bold">{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="w-full bg-surface-muted border border-border-default/50 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                            className="bg-accent-progress h-full rounded-full"
                            style={{ width: `${overallProgress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-16 justify-end flex-1">
                    <div className="flex flex-col items-center">
                        <span className="text-[12px] uppercase tracking-[0.1em] text-text-muted font-semibold mb-0.5">Milestones</span>
                        <span className="text-text-primary font-bold text-lg">{doneCount} <span className="text-text-muted font-medium opacity-50 px-1">/</span> {totalCount}</span>
                    </div>

                    <div className="flex flex-col items-center min-w-[120px]">
                        <span className="text-[12px] uppercase tracking-[0.1em] text-text-muted font-semibold mb-0.5">Target Launch</span>
                        <span className="text-text-primary font-bold text-lg">{targetLaunchDate}</span>
                    </div>
                </div>
            </motion.div>
        </LayoutWhite>
    );
}
