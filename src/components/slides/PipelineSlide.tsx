"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ChevronRight, AlertTriangle, Circle } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);


interface Step {
    label: string;
    icon?: string;
    status?: "done" | "current" | "next";
    badges?: string[];
    blockers?: string[];
}

interface PipelineData {
    steps: Step[];
}

function resolveIconFromLabel(label: string): React.ElementType {
    const lower = label.toLowerCase();
    if (lower.match(/triage|review|validate/)) return LucideIcons.ClipboardCheck;
    if (lower.match(/schema|metadata|architect/)) return LucideIcons.Layers;
    if (lower.match(/language|scope|international/)) return LucideIcons.Globe;
    if (lower.match(/convert|migrate|move/)) return LucideIcons.ArrowRightLeft;
    if (lower.match(/governance|policy|workflow/)) return LucideIcons.GitBranch;
    if (lower.match(/qa|test|quality/)) return LucideIcons.BadgeCheck;
    if (lower.match(/deliver|launch|release/)) return LucideIcons.Rocket;
    if (lower.match(/design|blueprint|template/)) return LucideIcons.PenTool;
    return Circle;
}

const STATUS_CONFIG = {
    done: {
        dotClass: "border-accent-success bg-accent-success text-surface-page",
        iconClass: "text-surface-page",
        labelClass: "text-accent-success font-semibold",
        statusText: "Done",
        statusClass: "text-accent-success",
    },
    current: {
        dotClass: "border-accent-info bg-accent-info text-surface-page shadow-md",
        iconClass: "text-surface-page",
        labelClass: "text-text-primary font-extrabold tracking-tight",
        statusText: "In Progress",
        statusClass: "text-accent-info font-bold",
    },
    next: {
        dotClass: "border-border-muted bg-surface-page text-border-muted",
        iconClass: "text-border-muted",
        labelClass: "text-text-secondary font-medium",
        statusText: "Up Next",
        statusClass: "text-text-muted",
    },
} as const;

export function PipelineSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide, deckMeta?: Record<string, string>, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { steps: [] }) as unknown as PipelineData;
    const steps = data.steps ?? [];
    const isStrategy = template === "strategy";

    return (
        <motion.div
            className="w-full h-full"
            variants={staggerContainer(disableAnimation)}
            initial="hidden"
            animate="visible"
        >
            <LayoutWhite center={false}>
                <motion.div variants={slideUpItem(disableAnimation)} className="relative z-10 w-full flex justify-center pt-10 pb-0">
                    <SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="text-accent-info" />
                </motion.div>

                <motion.div variants={slideUpItem(disableAnimation)}>
                    <Typography as="h2" variant="h1" className="text-center mb-0 mt-2">
                        {slide.title}
                    </Typography>
                </motion.div>

                <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
                    {!isStrategy ? (
                        /* Horizontal Swimlane Layout */
                        <div className="flex-1 w-full px-12 xl:px-24 pb-12 pt-16 flex flex-col justify-center">
                            <div className="grid w-full relative" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                                {steps.map((step, i) => {
                                    const status = step.status ?? "next";
                                    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.next;
                                    let IconComponent = resolveIconFromLabel(step.label);

                                    const isCurrent = status === "current";
                                    const isDone = status === "done";
                                    const isFirst = i === 0;
                                    const isPrevDone = !isFirst && steps[i - 1].status === "done";

                                    return (
                                        <div key={i} className="flex flex-col items-center relative gap-4">
                                            {/* Incoming Spine Segment */}
                                            {!isFirst && (() => {
                                                const prevStatus = steps[i - 1].status ?? "next";
                                                const currentStatus = status;
                                                // If previous is done or current AND we are in progress or done, make it a solid connected line.
                                                // Even if current is 'next', if the previous was completed/current, the line LEADING to us is the 'future' line,
                                                // so we want it dashed. But the line LEAVING a done node is solid.
                                                // Based on the prompt: Solid between completed/current node and the next. Leading to UP NEXT nodes is dashed.
                                                // This means the line from Current -> Next is dashed. The line from Done -> Current is solid.
                                                const isSolid = prevStatus === "done" || (prevStatus === "current" && currentStatus !== "next");
                                                const isDashed = !isSolid;

                                                return (
                                                    <div className={cn(
                                                        "absolute top-[40px] right-[50%] w-full h-[2px] -z-10 transition-colors duration-500",
                                                        isSolid ? "bg-accent-info" : "bg-transparent border-t-2 border-dashed border-border-muted/70"
                                                    )} />
                                                );
                                            })()}

                                            {/* Node Circle */}
                                            <motion.div
                                                className={cn(
                                                    "w-20 h-20 rounded-full flex items-center justify-center border-[3px] relative z-10 transition-all shadow-sm overflow-hidden",
                                                    isCurrent ? "border-accent-info shadow-[0_0_20px_rgba(20,151,227,0.25)] scale-110 text-accent-info" :
                                                        isDone ? "border-accent-success text-accent-success" : "border-text-muted text-text-muted"
                                                )}
                                                variants={slideUpItem(disableAnimation)}
                                            >
                                                {/* Glow Background Layer */}
                                                <div className="absolute inset-0 w-full h-full opacity-[0.15] bg-current pointer-events-none" />

                                                {isDone ? (
                                                    <LucideIcons.Check className="w-8 h-8 relative z-10 text-current" strokeWidth={3} />
                                                ) : (
                                                    <IconComponent className={cn("w-8 h-8 relative z-10 text-current")} strokeWidth={isCurrent ? 2.5 : 2} />
                                                )}
                                            </motion.div>

                                            {/* Node Labels */}
                                            <motion.div
                                                className="flex flex-col items-center text-center px-4 w-full gap-2 mt-2"
                                                variants={slideUpItem(disableAnimation)}
                                            >
                                                <Typography variant="badge" className={cn("px-3 py-1 rounded-full border bg-surface-page shadow-sm uppercase tracking-wider",
                                                    isCurrent ? "border-accent-info/30 text-accent-info" :
                                                        isDone ? "border-accent-success/30 text-accent-success" : "border-border-default text-text-muted"
                                                )}>
                                                    {cfg.statusText}
                                                </Typography>

                                                <Typography as="h3" variant="h2" className={cn("leading-tight mt-1 max-w-[200px]", isCurrent ? "text-text-primary" : "text-text-secondary")}>
                                                    {step.label}
                                                </Typography>

                                                {step.badges && step.badges.length > 0 && (
                                                    <div className="flex flex-wrap justify-center gap-1.5 mt-2 shrink-0">
                                                        {step.badges.map((b, bi) => (
                                                            <Typography key={bi} variant="caption" className="bg-surface-muted px-2 py-0.5 rounded text-text-secondary border border-border-default/50 font-semibold uppercase tracking-wider">
                                                                {b}
                                                            </Typography>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Blockers below */}
                                            {step.blockers && step.blockers.length > 0 && (
                                                <motion.div className="w-full flex flex-col gap-2 mt-4 px-2 sm:px-4 max-w-[260px] mx-auto" variants={slideUpItem(disableAnimation)}>
                                                    {step.blockers.map((bl, bli) => (
                                                        <div key={bli} className="w-full bg-surface-page border border-border-default rounded-lg p-3 shadow-sm flex items-start gap-2 relative overflow-hidden group hover:shadow-md transition-shadow">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-danger" />
                                                            <AlertTriangle className="w-4 h-4 text-accent-danger shrink-0 mt-0.5 ml-1" />
                                                            <Typography variant="caption" className="text-text-primary font-medium line-clamp-2 text-left leading-snug">
                                                                {bl}
                                                            </Typography>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Strategy Linear Flow (Legacy style) */
                        <div className="flex items-start justify-center gap-0 w-full px-12 pt-12" style={{ maxWidth: "88%", marginLeft: "auto", marginRight: "auto" }}>
                            {steps.map((step, i) => {
                                const status = step.status ?? "next";
                                const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.next;
                                let IconComponent = resolveIconFromLabel(step.label);
                                const isLast = i === steps.length - 1;

                                return (
                                    <div key={i} className="flex items-start flex-1 min-w-0">
                                        <motion.div
                                            className="flex flex-col items-center gap-4 flex-1 px-4"
                                            variants={slideUpItem(disableAnimation)}
                                        >
                                            <div
                                                className={cn(
                                                    "rounded-full flex items-center justify-center shadow-md relative",
                                                    status === "current" ? "pulse-ring-active" : "",
                                                    cfg.dotClass
                                                )}
                                                style={{
                                                    width: "clamp(64px, 7vw, 110px)",
                                                    height: "clamp(64px, 7vw, 110px)",
                                                    borderWidth: "clamp(4px, 0.4vw, 8px)"
                                                }}
                                            >
                                                <IconComponent className={cn("w-1/2 h-1/2", cfg.iconClass)} strokeWidth={status === "current" ? 2.5 : 2} />
                                            </div>

                                            <Typography
                                                variant="h2"
                                                className={cn("text-center leading-tight mt-2", cfg.labelClass)}
                                                style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}
                                            >
                                                {step.label}
                                            </Typography>

                                            {!isLast && (
                                                <div className="flex items-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0 hidden">
                                                    <ChevronRight className="w-8 h-8 text-border-muted" />
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
