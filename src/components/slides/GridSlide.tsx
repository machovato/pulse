"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "../ui/Typography";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);


interface Card {
    title: string;
    body: string;
    icon?: string;
}

interface GridData {
    cards: Card[];
}

function getIcon(name?: string, className?: string) {
    if (!name) return <CircleDot className={className} strokeWidth={2.5} />;

    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');

    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];

    if (!IconComponent) return <CircleDot className={className} strokeWidth={2.5} />;

    return <IconComponent className={className} strokeWidth={2.5} />;
}

const ACCENT_SEQUENCE = ["info", "success", "warning", "danger"] as const;
type AccentType = typeof ACCENT_SEQUENCE[number];

const ACCENT_CLASSES: Record<AccentType, { text: string; bg: string }> = {
    info: { text: "text-accent-info", bg: "bg-accent-info/10" },
    success: { text: "text-accent-success", bg: "bg-accent-success/10" },
    warning: { text: "text-accent-warning", bg: "bg-accent-warning/10" },
    danger: { text: "text-accent-danger", bg: "bg-accent-danger/10" }
};

export function GridSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { cards: [] }) as unknown as GridData;
    const cards = data.cards ?? [];
    const isStrategy = template === "strategy";
    const cols = isStrategy ? (cards.length <= 2 ? 1 : cards.length <= 4 ? 2 : 3) : 2;
    const isKickoff = template === "kickoff";

    const left = (
        <motion.div
            className={cn("flex flex-col gap-4 relative h-full w-full justify-center", !isKickoff && "dark-surface")}
            variants={slideUpItem(disableAnimation)}
        >
            <Typography variant="eyebrow" className="text-accent-info opacity-60 mb-2">
                {(slide.data as Record<string, string>)?.eyebrow || "DELIVERABLES"}
            </Typography>
            <Typography variant="h1" className="leading-tight mt-0 mb-0 pt-0">
                {slide.title}
            </Typography>
            <div className="w-8 h-0.5 bg-white opacity-30 mt-2" />
        </motion.div>
    );

    const right = (
        <div
            className="grid w-full h-full"
            style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${Math.ceil(cards.length / cols)}, 1fr)`,
                gap: "var(--spacing-card-gap)"
            }}
        >
            {cards.map((card, i) => {
                const borderAccent = isKickoff ? "info" : ACCENT_SEQUENCE[i % ACCENT_SEQUENCE.length];

                // Varied color palette for Kickoff icons
                const KICKOFF_COLORS = [
                    { text: "text-emerald-600", bg: "bg-emerald-50 text-emerald-600" },
                    { text: "text-indigo-600", bg: "bg-indigo-50 text-indigo-600" },
                    { text: "text-amber-600", bg: "bg-amber-50 text-amber-600" },
                    { text: "text-rose-600", bg: "bg-rose-50 text-rose-600" },
                    { text: "text-teal-600", bg: "bg-teal-50 text-teal-600" },
                    { text: "text-violet-600", bg: "bg-violet-50 text-violet-600" },
                ];

                const iconAccent = ACCENT_SEQUENCE[i % ACCENT_SEQUENCE.length];
                const classes = isKickoff
                    ? KICKOFF_COLORS[i % KICKOFF_COLORS.length]
                    : ACCENT_CLASSES[iconAccent as AccentType];

                return (
                    <MotionCard
                        key={i}
                        accent={borderAccent}
                        className="flex flex-col justify-center text-center items-center p-8 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                        variants={slideUpItem(disableAnimation)}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center mb-5 shrink-0 rounded-full",
                                classes.bg
                            )}
                            style={{
                                width: "clamp(48px, 12cqi, 64px)",
                                height: "clamp(48px, 12cqi, 64px)",
                            }}
                        >
                            {getIcon(card.icon, cn("w-7 h-7", classes.text))}
                        </div>
                        <Typography variant="h2" className="mb-3 leading-tight drop-shadow-sm font-bold">
                            {card.title}
                        </Typography>
                        <Typography variant="body" className="leading-relaxed opacity-90 max-w-[280px]">
                            {card.body}
                        </Typography>
                    </MotionCard>
                );
            })}
        </div>
    );

    return (
        <motion.div
            className="w-full h-full"
            variants={staggerContainer(disableAnimation)}
            initial="hidden"
            animate="visible"
        >
            <LayoutSplit
                leftContent={left}
                rightContent={right}
            />
        </motion.div>
    );
}
