"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";

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

function getBorderProps(severity: string) {
    switch (severity) {
        case "critical": return "border-l-[10px] border-l-accent-danger border-t-0 border-r-0 border-b-0";
        case "high": return "border-l-[10px] border-l-accent-warning border-t-0 border-r-0 border-b-0";
        case "moderate": return "border-l-[10px] border-l-border-muted border-t-0 border-r-0 border-b-0";
        default: return "border-l-[10px] border-l-border-muted border-t-0 border-r-0 border-b-0";
    }
}

export function ProblemSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? {}) as unknown as ProblemData;
    const primary = data.primary;
    const secondary = data.secondary ?? [];

    return (
        <LayoutWhite center={false}>
            <div className="w-full flex-1 flex flex-col justify-center py-12">
                <div className="mb-8 shrink-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-2">
                        Problem Space
                    </p>
                    <h2
                        className="font-bold text-text-primary leading-tight"
                        style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
                    >
                        {slide.title}
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8 flex-1 w-full mt-4">
                    {/* Primary Focus */}
                    {primary && (
                        <motion.div
                            className={`w-full md:w-1/2 flex flex-col pt-8 px-8 pb-10 rounded-2xl bg-surface-primary ${getBorderProps(primary.severity)} relative overflow-hidden h-full max-h-[600px] justify-start shadow-xl`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-8 flex justify-between items-start">
                                <div className={`px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider ${getBadgeProps(primary.severity)}`}>
                                    {primary.severity} Focus
                                </div>
                                <div className="p-3 bg-white/10 Backdrop-blur-sm rounded-xl border border-white/20">
                                    {getLucideIcon(primary.icon, "w-8 h-8 text-surface-page")}
                                </div>
                            </div>
                            <h3
                                className="font-extrabold text-white mb-6 leading-[1.05] drop-shadow-sm tracking-tight pr-4"
                                style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
                            >
                                {primary.title}
                            </h3>
                            <p className="text-2xl md:text-3xl text-text-on-emphasis/90 font-medium leading-normal max-w-xl mt-auto pb-2">
                                {primary.body}
                            </p>
                        </motion.div>
                    )}

                    {/* Secondary Cluster */}
                    {secondary.length > 0 && (
                        <div className="w-full md:w-1/2 flex flex-col h-full max-h-[600px] justify-between gap-4">
                            {secondary.map((item, i) => {
                                const borderClass = item.severity === 'critical' ? 'border-l-accent-danger' :
                                    item.severity === 'high' ? 'border-l-accent-warning' : 'border-l-border-muted';

                                // Scale padding and text size slightly based on how many cards there are so it always fills the space nicely
                                const paddingClass = secondary.length <= 3 ? 'p-6 md:p-8' : 'p-4 md:p-5';
                                const titleSize = secondary.length <= 3 ? 'text-2xl' : 'text-xl';
                                const bodySize = secondary.length <= 3 ? 'text-lg' : 'text-base';
                                const iconSize = secondary.length <= 3 ? 'w-8 h-8' : 'w-6 h-6';

                                return (
                                    <motion.div
                                        key={i}
                                        className={`flex-1 w-full rounded-2xl border border-border-default border-l-[8px] bg-surface-muted shadow-sm flex items-start gap-5 overflow-hidden ${borderClass} ${paddingClass}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                                    >
                                        <div className="mt-1 shrink-0 shadow-sm rounded-xl p-3 bg-surface-page border border-border-default">
                                            {getLucideIcon(item.icon, `${iconSize} text-text-secondary`)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                                <h4 className={`font-bold text-text-primary leading-tight truncate ${titleSize}`}>
                                                    {item.title}
                                                </h4>
                                                <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded tracking-wider shrink-0 w-fit ${getBadgeProps(item.severity)}`}>
                                                    {item.severity}
                                                </span>
                                            </div>
                                            <p className={`text-text-secondary leading-relaxed line-clamp-3 ${bodySize}`}>
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
    );
}
