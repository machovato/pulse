"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
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

// Trend arrows communicate KPI performance direction:
// up   = DTN Accent Lime #8DC63F  — positive performance indicator
// down = DTN Red         #C8192B  — negative, attention needed
// flat = DTN Neutral Mid #BCBEC0  — no significant change
function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
    if (!trend) return null;
    if (trend === "up") return <LucideIcons.TrendingUp className="w-5 h-5 text-accent-success" />;
    if (trend === "down") return <LucideIcons.TrendingDown className="w-5 h-5 text-accent-danger" />;
    return <LucideIcons.Minus className="w-5 h-5 text-text-muted" />;
}

function getIcon(name?: string) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className="w-6 h-6 text-accent-info" /> : null;
}

export function KpisSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? { items: [] }) as unknown as KpisData;
    const items = data.items ?? [];
    const cols = items.length <= 2 ? 2 : items.length === 3 ? 3 : 4;

    return (
        <LayoutWhite center={false}>
            {/* Slide title — eyebrow style at top */}
            <motion.p
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-info mb-8 pt-10 text-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {slide.title}
            </motion.p>

            {/* KPI scoreboard — centered, generous space */}
            <div className="flex-1 flex items-center justify-center w-full">
                <div
                    className="grid gap-8 w-full max-w-5xl"
                    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                >
                    {items.map((kpi, i) => (
                        <motion.div
                            key={i}
                            className="flex flex-col items-center text-center gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                        >
                            {/* Icon */}
                            {kpi.icon && (
                                <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-border-default/50 flex items-center justify-center mb-1">
                                    {getIcon(kpi.icon)}
                                </div>
                            )}

                            {/* Value — scoreboard */}
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="font-extrabold text-text-primary whitespace-nowrap drop-shadow-sm tracking-tight"
                                    style={{ fontSize: "clamp(42px, 5vw, 72px)", lineHeight: 1 }}
                                >
                                    {kpi.value}
                                </span>
                                <TrendIcon trend={kpi.trend} />
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

                            {/* Label */}
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                                {kpi.label}
                            </span>

                            {/* Note */}
                            {kpi.note && (
                                <span className="text-xs text-text-muted">{kpi.note}</span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </LayoutWhite>
    );
}
