"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";

interface KPIItem {
    label: string;
    value: string;
    icon?: string;
    trend?: "up" | "down" | "flat";
    note?: string;
}

interface KpisData {
    items: KPIItem[];
}

// Trend config for borders and icons:
// up   = DTN Accent Lime #8DC63F  — positive performance indicator
// down = DTN Red         #C8192B  — negative, attention needed
// flat = DTN Neutral Mid #BCBEC0  — no significant change
const TREND_CONFIG = {
    up: { borderClass: "border-t-[6px] border-t-accent-success", iconClass: "text-accent-success", icon: LucideIcons.TrendingUp },
    down: { borderClass: "border-t-[6px] border-t-accent-danger", iconClass: "text-accent-danger", icon: LucideIcons.TrendingDown },
    flat: { borderClass: "border-t-[6px] border-t-border-muted", iconClass: "text-border-muted", icon: LucideIcons.Minus }
};

function getIcon(name?: string) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className="w-6 h-6 text-accent-info" /> : null;
}

export function KpisSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? { items: [] }) as unknown as KpisData;
    const items = data.items ?? [];
    const cols = items.length <= 2 ? 1 : items.length === 3 ? 3 : items.length === 4 ? 2 : 3;
    const gridCols = items.length === 3 ? 3 : 2;

    return (
        <motion.div
            className="w-full h-full"
            variants={staggerContainer(disableAnimation)}
            initial="hidden"
            animate="visible"
        >
            <LayoutWhite center={true}>
                {/* Slide title & eyebrow */}
                <div className="w-full text-center mt-6 mb-10 flex flex-col items-center">
                    <motion.p
                        className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info mb-4"
                        variants={slideUpItem(disableAnimation)}
                    >
                        Project Status
                    </motion.p>
                    <motion.h1
                        className="text-slide-title font-bold text-text-primary mt-0"
                        variants={slideUpItem(disableAnimation)}
                    >
                        {slide.title}
                    </motion.h1>
                </div>

                {/* KPI scoreboard — dashboard widget panel grid */}
                <div className="flex-1 flex items-center justify-center w-full px-slide pb-slide">
                    <div
                        className="grid gap-card w-full max-w-6xl mx-auto"
                        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                    >
                        {items.map((kpi, i) => {
                            const trend = kpi.trend ?? "flat";
                            const trendCfg = TREND_CONFIG[trend];
                            const TrendIcon = trendCfg.icon;

                            return (
                                <motion.div
                                    key={i}
                                    className={`flex flex-col items-center text-center gap-3 bg-surface-secondary rounded-card shadow-card ${trendCfg.borderClass} border-x border-b border-x-border-default border-b-border-default`}
                                    style={{ padding: "var(--spacing-card-padding)" }}
                                    variants={slideUpItem(disableAnimation)}
                                >
                                    {/* Icon & Label */}
                                    <div className="flex items-center gap-3 mb-1">
                                        {kpi.icon && (
                                            <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
                                                {getIcon(kpi.icon)}
                                            </div>
                                        )}
                                        <span className="text-metric-unit font-semibold uppercase tracking-widest text-text-secondary">
                                            {kpi.label}
                                        </span>
                                    </div>

                                    {/* Value — scoreboard */}
                                    <div className="flex items-center justify-center gap-3">
                                        <span
                                            className="font-bold text-text-primary whitespace-nowrap text-metric-lg"
                                            style={{ lineHeight: 1 }}
                                        >
                                            {kpi.value}
                                        </span>
                                        {TrendIcon && (
                                            <TrendIcon className={`w-10 h-10 ${trendCfg.iconClass}`} strokeWidth={3.5} />
                                        )}
                                    </div>

                                    {/* Fraction Progress Bar */}
                                    {(() => {
                                        const match = kpi.value.match(/^(\d+(?:\.\d+)?)\s*(?:of|\/)\s*(\d+(?:\.\d+)?)$/i);
                                        if (match) {
                                            const num = parseFloat(match[1]);
                                            const den = parseFloat(match[2]);
                                            const pct = den > 0 ? Math.min(100, Math.max(0, (num / den) * 100)) : 0;
                                            return (
                                                <div className="w-full h-1.5 mt-0.5 mb-1 bg-surface-muted border border-border-default/50 rounded-full overflow-hidden shadow-inner">
                                                    <div className="h-full bg-accent-progress rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {/* Note */}
                                    {kpi.note && (
                                        <span className="text-caption text-text-muted mt-1">{kpi.note}</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
