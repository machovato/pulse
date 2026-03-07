"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LayoutBrand } from "./layouts/LayoutBrand";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";

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

function getIcon(name?: string, isStrategy?: boolean) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    if (!Icon) return null;
    return <Icon className={cn("w-5 h-5", isStrategy ? "text-text-on-hero opacity-70" : "text-text-on-hero opacity-90")} />;
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
                    "flex flex-col h-full px-slide pb-slide pt-12 justify-center"
                )}
                variants={staggerContainer(disableAnimation)}
                initial="hidden"
                animate="visible"
            >
                {/* Eyebrow */}
                <motion.p
                    className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60 mb-5"
                    variants={slideUpItem(disableAnimation)}
                >
                    Project Update
                </motion.p>

                {/* Title — Display size */}
                <motion.h1
                    className={cn(
                        "font-extrabold text-text-on-hero leading-none mb-6 tracking-tight",
                        isStrategy ? "text-slide-title" : ""
                    )}
                    style={{ fontSize: isStrategy ? undefined : "clamp(48px, 6.5vw, 96px)" }}
                    variants={slideUpItem(disableAnimation)}
                >
                    {slide.title}
                </motion.h1>

                {/* Subtitle */}
                {data.subtitle && (
                    <motion.p
                        className="text-text-on-hero text-slide-subtitle opacity-75 mb-3"
                        variants={slideUpItem(disableAnimation)}
                    >
                        {data.subtitle}
                    </motion.p>
                )}

                {/* Headline - Hidden horizontally on strategy to prevent redundancy */}
                {!isStrategy && data.headline && (
                    <motion.p
                        className="text-text-on-hero opacity-90 italic mb-6 border-l-accent border-white/40 pl-5 py-1 max-w-2xl bg-white/5 rounded-r-lg text-card-body"
                        variants={slideUpItem(disableAnimation)}
                    >
                        {data.headline}
                    </motion.p>
                )}

                {/* RAG pill — white variant */}
                {rag && (
                    <motion.div
                        className="mb-8 flex"
                        variants={slideUpItem(disableAnimation)}
                    >
                        <span
                            className="inline-flex items-center gap-3 bg-white/20 border-2 border-white/40 shadow-lg text-text-on-hero font-bold px-5 py-2.5 rounded-full backdrop-blur-md text-card-body"
                        >
                            <span className={cn("rounded-full shadow-inner w-3 h-3", RAG_DOTS[rag])} />
                            {RAG_LABELS[rag]}
                        </span>
                    </motion.div>
                )}

                {/* KPI Tiles */}
                {data.kpis && data.kpis.length > 0 && (
                    <div className="flex flex-wrap gap-card">
                        {data.kpis.map((kpi, i) => (
                            <motion.div
                                key={i}
                                className={cn(
                                    "flex flex-col gap-1 transition-all min-w-[140px]",
                                    isStrategy
                                        ? "bg-white/15 border-2 border-white/30 shadow-xl backdrop-blur-md rounded-card px-p-6 py-5"
                                        : "bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
                                )}
                                style={{
                                    padding: isStrategy ? "var(--spacing-card-padding)" : undefined,
                                    borderWidth: isStrategy ? "var(--border-width-card)" : "0px"
                                }}
                                variants={slideUpItem(disableAnimation)}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                            >
                                <div className="flex items-center gap-2 mb-1 text-badge">
                                    {getIcon(kpi.icon, isStrategy)}
                                    <span
                                        className={cn(
                                            "font-semibold uppercase tracking-widest",
                                            isStrategy ? "text-text-on-hero opacity-60" : "text-text-on-hero opacity-70"
                                        )}
                                    >
                                        {kpi.label}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span
                                        className={cn(
                                            "font-bold",
                                            isStrategy ? "text-text-on-hero text-metric-lg" : "text-text-on-hero text-3xl md:text-4xl"
                                        )}
                                        style={{ lineHeight: 1 }}
                                    >
                                        {kpi.value}
                                    </span>
                                    {isStrategy ? (
                                        <TrendIcon trend={kpi.trend} />
                                    ) : (
                                        kpi.trend === "up" ? <LucideIcons.TrendingUp className="text-text-on-hero w-5 h-5" /> :
                                            kpi.trend === "down" ? <LucideIcons.TrendingDown className="text-text-on-hero w-5 h-5" /> :
                                                kpi.trend === "flat" ? <LucideIcons.Minus className="text-text-on-hero opacity-50 w-5 h-5" /> : null
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
