"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LayoutBrand } from "./layouts/LayoutBrand";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";
import { Typography } from "../ui/Typography";

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
    if (trend === "up") return <LucideIcons.TrendingUp className="text-accent-success w-[1.2em] h-[1.2em]" />;
    if (trend === "down") return <LucideIcons.TrendingDown className="text-accent-danger w-[1.2em] h-[1.2em]" />;
    return <LucideIcons.Minus className="text-text-on-hero opacity-50 w-[1.2em] h-[1.2em]" />;
}

function getIcon(name?: string) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    if (!Icon) return null;
    return <Icon className="w-5 h-5 text-text-on-hero opacity-90" />;
}

import { staggerContainer, slideUpItem } from "@/lib/motion";

export function HeroSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? {}) as HeroData;
    const rag = data.rag;
    const isStrategy = template === "strategy";

    return (
        <LayoutBrand>
            <motion.div
                className={cn(
                    "flex flex-col h-full px-slide pb-slide pt-12 justify-center dark-surface gap-y-4"
                )}
                variants={staggerContainer(disableAnimation)}
                initial="hidden"
                animate="visible"
            >
                {/* Eyebrow */}
                <motion.div variants={slideUpItem(disableAnimation)}>
                    <Typography variant="eyebrow" className="text-text-on-emphasis opacity-70 mb-2">
                        Project Update
                    </Typography>
                </motion.div>

                {/* Title — Display size */}
                <motion.div variants={slideUpItem(disableAnimation)}>
                    <Typography
                        variant="display"
                        className="mb-2"
                    >
                        {slide.title}
                    </Typography>
                </motion.div>

                {/* Subtitle */}
                {data.subtitle && (
                    <motion.div variants={slideUpItem(disableAnimation)} className="mb-6">
                        <Typography
                            variant="subtitle"
                            className="opacity-80 md:text-xl lg:text-2xl"
                        >
                            {data.subtitle}
                        </Typography>
                    </motion.div>
                )}


                {/* RAG pill — white variant */}
                {rag && (
                    <motion.div
                        className="mb-8 flex"
                        variants={slideUpItem(disableAnimation)}
                    >
                        <span
                            className="inline-flex items-center gap-3 bg-white/20 border-2 border-white/40 shadow-lg text-text-on-hero font-bold px-5 py-2.5 rounded-full backdrop-blur-md"
                        >
                            <span className={cn("rounded-full shadow-inner w-3 h-3", RAG_DOTS[rag])} />
                            <Typography variant="body" className="font-bold">
                                {RAG_LABELS[rag]}
                            </Typography>
                        </span>
                    </motion.div>
                )}

                {/* KPI Tiles */}
                {data.kpis && data.kpis.length > 0 && (
                    <div className="flex flex-wrap gap-card mt-8">
                        {data.kpis.map((kpi, i) => (
                            <motion.div
                                key={i}
                                className={cn(
                                    "flex flex-col gap-1 transition-all min-w-[140px] backdrop-blur-md rounded-lg px-4 py-3",
                                    isStrategy
                                        ? "bg-white/15 border border-white/30 shadow-md"
                                        : "bg-white/10 border border-white/20 shadow-sm"
                                )}
                                variants={slideUpItem(disableAnimation)}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {getIcon(kpi.icon)}
                                    <Typography
                                        variant="caption"
                                        className="opacity-80 font-bold tracking-wider uppercase drop-shadow-sm"
                                        style={{ fontSize: "clamp(11px, 1vw, 13px)" }}
                                    >
                                        {kpi.label}
                                    </Typography>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <Typography
                                        variant="metric-medium"
                                        className="drop-shadow-sm font-bold"
                                        style={{ lineHeight: 1, fontSize: "clamp(18px, 2vw, 24px)" }}
                                    >
                                        {kpi.value}
                                    </Typography>
                                    {kpi.trend === "up" ? <LucideIcons.TrendingUp className="text-text-on-emphasis w-4 h-4" /> :
                                        kpi.trend === "down" ? <LucideIcons.TrendingDown className="text-text-on-emphasis w-4 h-4" /> :
                                            kpi.trend === "flat" ? <LucideIcons.Minus className="text-text-on-emphasis opacity-50 w-4 h-4" /> : null}
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
            </motion.div>
        </LayoutBrand>
    );
}
