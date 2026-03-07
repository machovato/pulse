"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface ProblemItem {
    title: string;
    body: string;
    icon?: string;
    severity: "critical" | "high" | "moderate";
}

interface ProblemData {
    primary?: ProblemItem;
    secondary?: ProblemItem[];
}

function getLucideIcon(name?: string, className?: string) {
    if (!name) return <CircleDot className={className || "w-5 h-5 text-gray-400"} />;
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
    if (!IconComponent) return <CircleDot className={className || "w-5 h-5 text-text-muted"} />;
    return <IconComponent className={className || "w-5 h-5"} />;
}

function getBadgeProps(severity: string) {
    switch (severity) {
        case "critical": return "bg-accent-danger text-surface-page";
        case "high": return "bg-accent-warning text-text-primary";
        case "moderate": return "bg-border-muted text-text-primary";
        default: return "bg-border-muted text-text-primary";
    }
}

function getBorderColor(severity: string) {
    switch (severity) {
        case "critical": return "border-l-accent-danger";
        case "high": return "border-l-accent-warning";
        case "moderate": return "border-l-border-muted";
        default: return "border-l-border-muted";
    }
}

export function ProblemSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? {}) as unknown as ProblemData;
    const primary = data.primary;
    const secondary = data.secondary ?? [];

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutWhite center={false}>
                <div className="w-full flex-1 flex flex-col justify-center py-12 px-slide">
                    <motion.div className="mb-8 shrink-0" variants={slideUpItem(disableAnimation)}>
                        <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info mb-2">
                            Problem Space
                        </p>
                        <h2
                            className="font-bold text-text-primary leading-tight text-slide-title"
                            style={{ fontWeight: "var(--font-weight-title)" }}
                        >
                            {slide.title}
                        </h2>
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-8 flex-1 w-full mt-4">
                        {/* Primary Focus */}
                        {primary && (
                            <motion.div
                                className={cn(
                                    "w-full md:w-1/2 flex flex-col pt-8 px-8 pb-10 rounded-card bg-surface-primary border-card border-l-accent relative overflow-hidden h-full max-h-[600px] justify-start shadow-xl",
                                    getBorderColor(primary.severity)
                                )}
                                style={{
                                    borderWidth: "var(--border-width-card)",
                                    borderLeftWidth: "var(--border-width-accent)"
                                }}
                                variants={slideUpItem(disableAnimation)}
                            >
                                <div className="mb-8 flex justify-between items-start">
                                    <div className={cn("px-3 py-1 text-badge font-bold uppercase rounded-badge tracking-wider", getBadgeProps(primary.severity))}>
                                        {primary.severity} Focus
                                    </div>
                                    <div className="p-3 bg-white/10 Backdrop-blur-sm rounded-xl border border-white/20">
                                        {getLucideIcon(primary.icon, "w-8 h-8 text-surface-page")}
                                    </div>
                                </div>
                                <h3
                                    className="font-bold text-white mb-6 leading-[1.05] drop-shadow-sm tracking-tight pr-4 text-metric-lg"
                                    style={{ fontWeight: "var(--font-weight-title)" }}
                                >
                                    {primary.title}
                                </h3>
                                <p className="text-card-title text-text-on-emphasis/90 font-medium leading-normal max-w-xl mt-auto pb-2">
                                    {primary.body}
                                </p>
                            </motion.div>
                        )}

                        {/* Secondary Cluster */}
                        {secondary.length > 0 && (
                            <div className="w-full md:w-1/2 flex flex-col h-full max-h-[600px] justify-between gap-4">
                                {secondary.map((item, i) => {
                                    // Scale padding and text size slightly based on how many cards there are
                                    const isDense = secondary.length > 3;

                                    return (
                                        <motion.div
                                            key={i}
                                            className={cn(
                                                "flex-1 w-full rounded-card border-card border-l-accent bg-surface-muted shadow-sm flex items-start gap-5 overflow-hidden p-card",
                                                getBorderColor(item.severity),
                                                isDense && "p-4"
                                            )}
                                            style={{
                                                borderWidth: "var(--border-width-card)",
                                                borderLeftWidth: "var(--border-width-accent)"
                                            }}
                                            variants={slideUpItem(disableAnimation)}
                                        >
                                            <div className="mt-1 shrink-0 shadow-sm rounded-xl p-3 bg-surface-page border border-border-default">
                                                {getLucideIcon(item.icon, cn("text-text-secondary", isDense ? "w-6 h-6" : "w-8 h-8"))}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                                    <h4 className={cn("font-bold text-text-primary leading-tight truncate text-card-title", isDense && "text-lg")}>
                                                        {item.title}
                                                    </h4>
                                                    <span className={cn("px-2 py-0.5 text-badge font-bold uppercase rounded-badge tracking-wider shrink-0 w-fit", getBadgeProps(item.severity))}>
                                                        {item.severity}
                                                    </span>
                                                </div>
                                                <p className={cn("text-text-secondary leading-relaxed line-clamp-3 text-card-body", isDense && "text-sm")}>
                                                    {item.body}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
