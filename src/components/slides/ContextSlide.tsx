"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";

interface ContextItem {
    title: string;
    body: string;
    icon?: string;
    status: "confirmed" | "in-progress" | "pending";
}

interface ContextData {
    items: ContextItem[];
}

function getLucideIcon(name?: string) {
    if (!name) return <CircleDot className="w-5 h-5 text-gray-400" />;
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
    if (!IconComponent) return <CircleDot className="w-5 h-5 text-text-muted" />;
    return <IconComponent className="w-5 h-5" />;
}

export function ContextSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? { items: [] }) as unknown as ContextData;
    const items = data.items ?? [];

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutWhite center={false}>
                <div className="w-full flex-1 flex flex-col justify-center py-12 px-slide">
                    <motion.div className="mb-12 shrink-0" variants={slideUpItem(disableAnimation)}>
                        <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60 mb-2">
                            Context
                        </p>
                        <h2
                            className="font-bold text-text-primary leading-tight text-slide-title"
                            style={{ fontWeight: "var(--font-weight-title)" }}
                        >
                            {slide.title}
                        </h2>
                    </motion.div>

                    <div className="flex-1 w-full overflow-y-auto px-4 pb-12 relative z-10" style={{ maxHeight: "calc(100vh - 200px)" }}>
                        <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto py-8">
                            {items.map((item, i) => {
                                let StatusIcon = <CircleDot className="w-8 h-8 text-text-muted" />;
                                let statusColor = "border-border-default";
                                let titleColor = "text-text-primary";
                                let bodyColor = "text-text-primary/90";
                                let iconBg = "bg-surface-page text-text-primary";

                                if (item.status === "confirmed") {
                                    StatusIcon = <CheckCircle2 className="w-8 h-8 text-accent-success fill-surface-page drop-shadow-sm" />;
                                    statusColor = "border-accent-success bg-surface-primary shadow-md";
                                    titleColor = "text-text-on-emphasis";
                                    bodyColor = "text-text-on-emphasis/90";
                                    iconBg = "bg-white/10 text-text-on-emphasis border-white/20";
                                } else if (item.status === "in-progress") {
                                    StatusIcon = <div className="w-8 h-8 rounded-full bg-accent-info flex items-center justify-center shadow-inner"><Loader2 className="w-5 h-5 text-white animate-spin-slow" /></div>;
                                    statusColor = "border-accent-info bg-surface-primary shadow-md";
                                    titleColor = "text-text-on-emphasis";
                                    bodyColor = "text-text-on-emphasis/90";
                                    iconBg = "bg-white/10 text-text-on-emphasis border-white/20";
                                } else if (item.status === "pending") {
                                    StatusIcon = <Clock className="w-8 h-8 text-border-muted" />;
                                    statusColor = "border-border-muted bg-surface-secondary opacity-80";
                                }

                                return (
                                    <motion.div
                                        key={i}
                                        className={`flex items-start gap-6 p-card border-card rounded-card transition-all ${statusColor}`}
                                        style={{
                                            borderWidth: "var(--border-width-card)",
                                            borderLeftWidth: "var(--border-width-accent)"
                                        }}
                                        variants={slideUpItem(disableAnimation)}
                                    >
                                        <div className="mt-1 shrink-0 bg-surface-page rounded-full flex items-center justify-center shadow-sm">
                                            {StatusIcon}
                                        </div>
                                        <div className="flex-1 w-full min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`shrink-0 flex p-2 border rounded-xl shadow-sm ${iconBg}`}>
                                                        {getLucideIcon(item.icon)}
                                                    </span>
                                                    <h3 className={`text-card-title font-bold leading-tight ${titleColor}`} style={{ fontWeight: "var(--font-weight-card-title)" }}>
                                                        {item.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <p className={`text-card-body font-medium leading-relaxed max-w-4xl sm:ml-[3.5rem] mt-3 ${bodyColor}`}>
                                                {item.body}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
