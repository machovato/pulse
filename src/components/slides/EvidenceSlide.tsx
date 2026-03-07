"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";

interface EvidencePoint {
    metric: string;
    label: string;
    source: string;
    type: "quantified" | "qualitative";
    body: string;
}

interface EvidenceData {
    points: EvidencePoint[];
}

function renderMetric(metricStr: string, isQualitative: boolean) {
    if (metricStr.includes('→')) {
        const [before, after] = metricStr.split('→').map(s => s.trim());
        return (
            <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-text-on-emphasis/40 line-through decoration-text-on-emphasis/40 decoration-[3px]" style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
                    {before}
                </span>
                <span className="text-text-on-emphasis/40 font-light" style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
                    →
                </span>
                <span className={`font-extrabold ${isQualitative ? 'text-accent-warning' : 'text-accent-success'}`} style={{ fontSize: "clamp(48px, 6vw, 76px)" }}>
                    {after}
                </span>
            </div>
        );
    }

    if (!isQualitative) {
        // Match numbers, decimals, commas, starting symbols ($, +, -, ~), and ending symbols (k, m, b, K, M, B, %, +)
        const match = metricStr.match(/^([^\d]*[\d.,]+[kmbtKMBT%+]*)\s*(.*)$/);

        if (match && match[1]) {
            const numPart = match[1];
            const textPart = match[2];

            return (
                <div className="flex flex-col xl:flex-row xl:items-baseline gap-2">
                    <span className="font-extrabold text-white drop-shadow-md tracking-tight" style={{ fontSize: "clamp(64px, 8vw, 110px)", lineHeight: 0.9 }}>
                        {numPart}
                    </span>
                    {textPart && (
                        <span className="text-2xl font-bold text-text-on-emphasis/80 max-w-[250px] leading-tight mt-2 xl:mt-0 xl:ml-3">
                            {textPart}
                        </span>
                    )}
                </div>
            );
        }
    }

    return (
        <span className={`font-extrabold drop-shadow-md tracking-tight text-white`} style={{ fontSize: "clamp(42px, 6vw, 84px)", lineHeight: 1.05 }}>
            {metricStr}
        </span>
    );
}

export function EvidenceSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? { points: [] }) as unknown as EvidenceData;
    const points = data.points ?? [];

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutWhite center={false}>
                <div className="w-full flex-1 flex flex-col justify-center py-12">
                    <motion.div className="mb-12 shrink-0" variants={slideUpItem(disableAnimation)}>
                        <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60 mb-2">
                            Evidence
                        </p>
                        <h2
                            className="font-bold text-text-primary leading-tight"
                            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
                        >
                            {slide.title}
                        </h2>
                    </motion.div>

                    <div
                        className={`flex-1 grid gap-6 w-full mt-4 items-stretch
                    ${points.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                                points.length === 2 ? 'grid-cols-2 max-w-5xl mx-auto' :
                                    'grid-cols-3 w-full'}`}
                    >
                        {points.map((point, i) => {
                            const isQualitative = point.type === "qualitative";

                            return (
                                <motion.div
                                    key={i}
                                    className={`flex flex-col justify-between p-8 md:p-10 rounded-2xl shadow-xl transition-all h-full border border-border-default
                                    ${isQualitative
                                            ? 'border-t-[10px] border-t-accent-warning bg-surface-primary'
                                            : 'border-t-[10px] border-t-accent-info bg-surface-primary'
                                        }
                                `}
                                    style={{ minHeight: "280px" }}
                                    variants={slideUpItem(disableAnimation)}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                >
                                    <div className="mb-auto">
                                        <p className="text-sm font-bold uppercase tracking-[0.15em] text-text-on-emphasis/60 mb-4">
                                            {point.label}
                                        </p>
                                        <div className="mb-6 leading-none">
                                            {renderMetric(point.metric, isQualitative)}
                                        </div>
                                    </div>

                                    <div className="mt-10 relative bg-surface-muted p-5 rounded-xl border border-border-default/50">
                                        <p className="text-lg text-text-primary font-medium leading-relaxed mb-4">
                                            {isQualitative ? `"${point.body}"` : point.body}
                                        </p>
                                        <p className="text-[13px] font-bold uppercase tracking-wider text-accent-info flex items-center gap-2 before:content-['—'] before:mr-1">
                                            {point.source}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
