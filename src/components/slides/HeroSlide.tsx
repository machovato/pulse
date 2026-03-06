"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LayoutBrand } from "./layouts/LayoutBrand";
import type { LooseSlide } from "@/lib/schema";

interface HeroData {
    subtitle?: string;
    headline?: string;
    rag?: "green" | "yellow" | "red";
    kpis?: { label: string; value: string; icon?: string; trend?: "up" | "down" | "flat" }[];
}

const RAG_LABELS = { green: "On Track", yellow: "At Risk", red: "Off Track" };
const RAG_DOTS = {
    green: "bg-accent-success",
    yellow: "bg-accent-warning",
    red: "bg-accent-danger",
};

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
    if (!trend) return null;
    const size = { width: "clamp(16px, 1.5vw, 24px)", height: "clamp(16px, 1.5vw, 24px)" };
    if (trend === "up") return <LucideIcons.TrendingUp className="text-accent-success" style={size} />;
    if (trend === "down") return <LucideIcons.TrendingDown className="text-accent-danger" style={size} />;
    return <LucideIcons.Minus className="text-text-on-hero opacity-50" style={size} />;
}

function getIcon(name?: string) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className="w-5 h-5 text-text-on-hero opacity-70" /> : null;
}

export function HeroSlide({ slide, deckMeta }: { slide: LooseSlide; deckMeta?: Record<string, string> }) {
    const data = (slide.data ?? {}) as HeroData;
    const rag = data.rag;

    return (
        <LayoutBrand>
            <div className="flex flex-col justify-center h-full px-16 py-12">
                {/* Eyebrow */}
                <motion.p
                    className="font-medium uppercase tracking-[0.18em] text-text-on-hero opacity-60 mb-5"
                    style={{ fontSize: "clamp(11px, 1vw, 15px)" }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    Project Update
                </motion.p>

                {/* Title — Display size */}
                <motion.h1
                    className="font-bold text-text-on-hero leading-tight mb-4"
                    style={{
                        fontSize: "clamp(40px, 5vw, 68px)",
                        lineHeight: 1.08,
                        fontFamily: "Inter, sans-serif",
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.07 }}
                >
                    {slide.title}
                </motion.h1>

                {/* Subtitle */}
                {data.subtitle && (
                    <motion.p
                        className="text-text-on-hero opacity-75 mb-3"
                        style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.13 }}
                    >
                        {data.subtitle}
                    </motion.p>
                )}

                {/* Headline - Hidden horizontally on strategy to prevent redundancy */}
                {deckMeta?.template !== 'strategy' && data.headline && (
                    <motion.p
                        className="text-text-on-hero opacity-90 italic mb-6 border-l-[6px] border-white/40 pl-5 py-1 max-w-2xl bg-white/5 rounded-r-lg"
                        style={{ fontSize: "clamp(16px, 1.5vw, 20px)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.17 }}
                    >
                        {data.headline}
                    </motion.p>
                )}

                {/* RAG pill — white variant */}
                {rag && (
                    <motion.div
                        className="mb-8 flex"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <span
                            className="inline-flex items-center gap-3 bg-white/20 border-2 border-white/40 shadow-lg text-text-on-hero font-bold px-5 py-2.5 rounded-full backdrop-blur-md"
                            style={{ fontSize: "clamp(14px, 1.3vw, 18px)" }}
                        >
                            <span className={`rounded-full shadow-inner ${RAG_DOTS[rag]}`} style={{ width: "clamp(12px, 1.1vw, 16px)", height: "clamp(12px, 1.1vw, 16px)" }} />
                            {RAG_LABELS[rag]}
                        </span>
                    </motion.div>
                )}

                {/* KPI Tiles — white bg, navy text, float on blue */}
                {data.kpis && data.kpis.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {data.kpis.map((kpi, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col gap-1.5 bg-white/15 border-2 border-white/30 shadow-xl backdrop-blur-md rounded-2xl px-6 py-5 min-w-[160px]"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.24 + i * 0.07 }}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {getIcon(kpi.icon)}
                                    <span
                                        className="font-semibold uppercase tracking-widest text-text-on-hero opacity-60"
                                        style={{ fontSize: "clamp(10px, 0.9vw, 14px)" }}
                                    >
                                        {kpi.label}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-text-on-hero font-bold" style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}>
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
                                            <div className="w-full h-1.5 mt-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-sm" style={{ width: `${pct}%` }} />
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </LayoutBrand>
    );
}
