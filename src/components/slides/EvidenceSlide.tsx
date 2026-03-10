"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { Typography } from "../ui/Typography";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);

import { SlideBackgroundIcon } from "./SlideBackgroundIcon";

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
                <span className="text-text-muted/60 line-through decoration-text-muted/40 decoration-[3px]" style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
                    {before}
                </span>
                <span className="text-text-muted/40 font-light" style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
                    →
                </span>
                <Typography as="span" variant="metric" className={isQualitative ? 'text-accent-warning' : 'text-accent-success'}>
                    {after}
                </Typography>
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
                    <Typography as="span" variant="metric" className="text-text-primary drop-shadow-sm tracking-tight">
                        {numPart}
                    </Typography>
                    {textPart && (
                        <Typography as="span" variant="h2" className="text-text-secondary max-w-[250px] leading-tight mt-2 xl:mt-0 xl:ml-3">
                            {textPart}
                        </Typography>
                    )}
                </div>
            );
        }
    }

    return (
        <Typography as="span" variant="metric" className="drop-shadow-sm tracking-tight text-text-primary">
            {metricStr}
        </Typography>
    );
}

export function EvidenceSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? { points: [] }) as unknown as EvidenceData;
    const points = data.points ?? [];

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutWhite center={false} backgroundNode={<SlideBackgroundIcon title={slide.title} position="bottom-right" />}>
                <div className="w-full flex-1 flex flex-col justify-start py-12 relative z-10">
                    <motion.div className="mb-12 shrink-0" variants={slideUpItem(disableAnimation)}>
                        <Typography variant="eyebrow" className="text-accent-info opacity-60 mb-2">
                            Evidence
                        </Typography>
                        <Typography as="h2" variant="h1" className="leading-tight mt-0 pt-0">
                            {slide.title}
                        </Typography>
                    </motion.div>

                    <div
                        className={`flex-1 grid gap-6 w-full mt-4 items-start
                    ${points.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                                points.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto' :
                                    points.length === 4 ? 'grid-cols-2 xl:grid-cols-4 w-full' :
                                        'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full'}`}
                    >
                        {points.map((point, i) => {
                            const isQualitative = point.type === "qualitative";

                            return (
                                <MotionCard
                                    key={i}
                                    accent={isQualitative ? "warning" : "info"}
                                    className="flex flex-col justify-between shadow-xl transition-all h-fit bg-surface-primary"
                                    variants={slideUpItem(disableAnimation)}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                >
                                    {/* Card content wrapper (CardBase usually handles padding, but we override padding to 0 and apply standard here to match the hover effects/styling. Actually, CardBase uses Var(--spacing-card-padding), so let's let CardBase apply padding naturally, since p-8 md:p-10 is standard card padding anyway. Let's remove padding: 0 from above) */}
                                    <div className="flex flex-col h-full" style={{ padding: "var(--spacing-card-padding)" }}>
                                        <div>
                                            <Typography variant="metric-unit" className="opacity-90 tracking-wide font-bold mb-4 drop-shadow-sm whitespace-normal break-words">
                                                {point.label}
                                            </Typography>
                                            <div className="mb-2 leading-none">
                                                {renderMetric(point.metric, isQualitative)}
                                            </div>
                                        </div>

                                        <div className="mt-6 relative bg-surface-muted p-5 rounded-xl border border-border-default/50">
                                            <Typography variant="body" className="font-medium leading-relaxed mb-4">
                                                {isQualitative ? `"${point.body}"` : point.body}
                                            </Typography>
                                            <Typography variant="caption" className="text-accent-info font-bold flex items-center gap-2 before:content-['—'] before:mr-1">
                                                {point.source}
                                            </Typography>
                                        </div>
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
