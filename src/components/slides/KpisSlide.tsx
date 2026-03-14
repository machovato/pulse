"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);

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
// up   = Accent Lime #8DC63F  — positive performance indicator
// down = Red         #C8192B  — negative, attention needed
// flat = Neutral Mid #BCBEC0  — no significant change
const TREND_CONFIG: Record<string, { iconClass: string; icon: any; accent: "success" | "danger" | "neutral" }> = {
    up: { iconClass: "text-accent-success", icon: LucideIcons.TrendingUp, accent: "success" },
    down: { iconClass: "text-accent-danger", icon: LucideIcons.TrendingDown, accent: "danger" },
    flat: { iconClass: "text-border-muted", icon: LucideIcons.Minus, accent: "neutral" }
};

function getIcon(name?: string) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className="w-6 h-6 text-accent-info" /> : null;
}

export function KpisSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide, deckMeta?: Record<string, string>, disableAnimation?: boolean }) {
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
                <div className="w-full text-center mt-6 mb-4 flex flex-col items-center shrink-0 relative z-10">
                    <motion.div variants={slideUpItem(disableAnimation)}>
                        <SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="mb-2 text-accent-info" />
                    </motion.div>
                    <motion.div variants={slideUpItem(disableAnimation)}>
                        <Typography as="h1" variant="h1" className="mt-0">
                            {slide.title}
                        </Typography>
                    </motion.div>
                </div>

                {/* KPI scoreboard — dashboard widget panel grid */}
                <div className="flex-1 flex items-stretch w-full px-slide pb-slide pt-4">
                    <div
                        className="grid gap-card w-full max-w-7xl mx-auto items-stretch h-full"
                        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                    >
                        {items.map((kpi, i) => {
                            const trend = kpi.trend ?? "flat";
                            const trendCfg = TREND_CONFIG[trend];
                            const TrendIcon = trendCfg.icon;

                            return (
                                <MotionCard
                                    key={i}
                                    accent={trendCfg.accent}
                                    className="flex flex-col text-center transition-all h-full"
                                    variants={slideUpItem(disableAnimation)}
                                >
                                    {/* Label at Top */}
                                    <div className="flex flex-col items-center gap-2 mb-auto shrink-0 pt-2">
                                        {kpi.icon && (
                                            <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center shrink-0">
                                                {getIcon(kpi.icon)}
                                            </div>
                                        )}
                                        <Typography variant="caption" className="font-bold tracking-wider text-text-secondary uppercase">
                                            {kpi.label}
                                        </Typography>
                                    </div>

                                    {/* Metric Center */}
                                    <div className="flex flex-col items-center justify-center py-6 my-auto">
                                        <div className="flex items-center justify-center gap-3">
                                            <Typography
                                                variant="metric"
                                                className="whitespace-nowrap tracking-tight drop-shadow-sm"
                                                style={{ lineHeight: 1 }}
                                            >
                                                {kpi.value}
                                            </Typography>
                                            {TrendIcon && (
                                                <TrendIcon className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 ${trendCfg.iconClass}`} strokeWidth={3.5} />
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
                                                    <div className="w-full max-w-xs h-1.5 mt-4 bg-surface-muted border border-border-default/50 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full bg-accent-progress rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    {/* Description/Note Bottom */}
                                    <div className="mt-auto shrink-0 pb-2">
                                        {kpi.note && (
                                            <Typography variant="body" className="text-text-muted">
                                                {kpi.note}
                                            </Typography>
                                        )}
                                    </div>
                                </MotionCard>
                            );
                        })}
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
