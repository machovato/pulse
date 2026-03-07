"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ChevronRight, AlertTriangle, Circle } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";

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

export function PipelineSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
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
                <motion.p
                    className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info pt-10 pb-0 text-center w-full"
                    variants={slideUpItem(disableAnimation)}
                >
                    Pipeline
                </motion.p>

                <motion.h2
                    className="font-bold text-text-primary text-center mb-0 mt-2"
                    style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
                    variants={slideUpItem(disableAnimation)}
                >
                    {slide.title}
                </motion.h2>

                <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
                    {!isStrategy ? (
                        /* Status Kanban Layout */
                        <div className="flex-1 flex gap-section overflow-x-auto px-slide pb-slide pt-8 items-stretch">
                            {steps.map((step, i) => {
                                const status = step.status ?? "next";
                                const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.next;
                                let IconComponent = resolveIconFromLabel(step.label);

                                // Asymmetric layout logic
                                const isCurrent = status === "current";
                                const columnWidthClass = isCurrent
                                    ? "flex-auto basis-[45%] min-w-[400px] max-w-[600px]"
                                    : "flex-1 basis-[15%] min-w-[220px] max-w-[280px]";

                                return (
                                    <motion.div
                                        key={i}
                                        className={cn("flex flex-col gap-4 transition-all duration-300", columnWidthClass)}
                                        variants={staggerContainer(disableAnimation)}
                                    >
                                        {/* Column Header - Fixed Height for Alignment */}
                                        <motion.div
                                            className={cn(
                                                "px-4 py-3 rounded-t-lg flex flex-col justify-center min-h-[4.5rem]",
                                                isCurrent ? "bg-dtn-navy border border-dtn-navy border-b-0" : "bg-surface-muted border border-border-default border-b-2"
                                            )}
                                            variants={slideUpItem(disableAnimation)}
                                        >
                                            <div className="flex items-start justify-between gap-3 w-full">
                                                <div className="flex items-start gap-2 max-w-[70%]">
                                                    <IconComponent className={cn("w-5 h-5 shrink-0 mt-0.5", isCurrent ? "text-white" : cfg.statusClass)} />
                                                    <span className={cn(
                                                        "font-bold text-card-title uppercase tracking-wider leading-tight",
                                                        isCurrent ? "text-white" : "text-text-primary"
                                                    )}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase shrink-0 mt-1",
                                                    isCurrent ? "text-dtn-cyan drop-shadow-sm" : cfg.statusClass
                                                )}>
                                                    {cfg.statusText}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* Item Card */}
                                        <motion.div
                                            className="flex-1 bg-surface-secondary rounded-b-lg border border-border-default border-t-0 p-5 shadow-card flex flex-col gap-5"
                                            variants={slideUpItem(disableAnimation)}
                                        >
                                            {isCurrent && (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <span className="text-xs font-bold text-accent-info uppercase tracking-widest">Progress</span>
                                                        <span className="text-sm font-bold text-text-primary">65%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden mb-2">
                                                        <motion.div
                                                            className="h-full bg-accent-info rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "65%" }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                        />
                                                    </div>

                                                    {/* Elevated Blockers right under progress */}
                                                    {step.blockers && step.blockers.length > 0 && (
                                                        <motion.div className="flex flex-col gap-2 mt-2" variants={slideUpItem(disableAnimation)}>
                                                            <span className="text-[10px] font-bold text-accent-danger uppercase tracking-widest">Attention Required</span>
                                                            {step.blockers.map((bl, bli) => (
                                                                <div key={bli} className="flex items-start gap-3 bg-accent-danger/5 p-4 rounded-md border border-accent-danger/20 shadow-sm">
                                                                    <AlertTriangle className="w-5 h-5 text-accent-danger shrink-0 drop-shadow-sm" />
                                                                    <span className="text-card-body font-semibold text-text-primary leading-snug">{bl}</span>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}

                                            {step.badges && step.badges.length > 0 && (
                                                <motion.div className={cn(
                                                    "flex flex-wrap gap-2",
                                                    isCurrent && "mt-auto pt-4 border-t border-border-default/30"
                                                )} variants={slideUpItem(disableAnimation)}>
                                                    {step.badges.map((b, bi) => (
                                                        <span key={bi} className="px-2.5 py-1 bg-surface-muted text-text-secondary text-xs font-bold rounded uppercase tracking-tight border border-border-default/50">
                                                            {b}
                                                        </span>
                                                    ))}
                                                </motion.div>
                                            )}

                                            {/* Fallback for non-current blockers */}
                                            {!isCurrent && step.blockers && step.blockers.length > 0 && (
                                                <motion.div className={cn(
                                                    "flex flex-col gap-2",
                                                    step.badges && step.badges.length > 0 && "pt-4 border-t border-border-default/30"
                                                )} variants={slideUpItem(disableAnimation)}>
                                                    <span className="text-[10px] font-bold text-accent-danger uppercase tracking-widest">Attention Required</span>
                                                    {step.blockers.map((bl, bli) => (
                                                        <div key={bli} className="flex items-start gap-2 bg-accent-danger/5 p-3 rounded border border-accent-danger/10">
                                                            <AlertTriangle className="w-4 h-4 text-accent-danger shrink-0 mt-0.5" />
                                                            <span className="text-xs font-medium text-text-primary leading-snug">{bl}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
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

                                            <span
                                                className={cn("text-center leading-tight mt-2", cfg.labelClass)}
                                                style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}
                                            >
                                                {step.label}
                                            </span>

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
