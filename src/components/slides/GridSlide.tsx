"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";

interface Card {
    title: string;
    body: string;
    icon?: string;
}

interface GridData {
    cards: Card[];
}

function getIconColorMapping(iconName: string): { color: string, bgClass: string } {
    const name = iconName.toLowerCase();
    if (['table', 'database', 'grid'].includes(name)) return { color: "var(--accent-success)", bgClass: "bg-accent-success/10" };
    if (['file-check', 'check-circle', 'shield-check'].includes(name)) return { color: "var(--accent-success)", bgClass: "bg-accent-success/10" };
    if (['shield-alert', 'alert-triangle', 'shield'].includes(name)) return { color: "var(--accent-danger)", bgClass: "bg-accent-danger/10" };
    if (['magnet', 'zap', 'trending-up'].includes(name)) return { color: "var(--accent-info)", bgClass: "bg-accent-info/10" };
    if (['calendar', 'clock', 'timer'].includes(name)) return { color: "var(--accent-warning)", bgClass: "bg-accent-warning/10" };
    return { color: "var(--accent-info)", bgClass: "bg-accent-info/10" };
}

function getIcon(name?: string) {
    if (!name) {
        return {
            element: <CircleDot className="w-5 h-5 text-accent-info" />,
            theme: getIconColorMapping('default')
        };
    }

    const mapping = getIconColorMapping(name);
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');

    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];

    if (!IconComponent) {
        return {
            element: <CircleDot className="w-5 h-5" style={{ color: mapping.color }} />,
            theme: mapping
        };
    }

    return {
        element: <IconComponent className="w-5 h-5" style={{ color: mapping.color }} />,
        theme: mapping
    };
}

export function GridSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { cards: [] }) as unknown as GridData;
    const cards = data.cards ?? [];
    const isStrategy = template === "strategy";
    const cols = isStrategy ? (cards.length <= 2 ? 1 : cards.length <= 4 ? 2 : 3) : 2;

    const left = (
        <motion.div className="flex flex-col gap-4" variants={slideUpItem(disableAnimation)}>

            <h2
                className="font-bold text-text-on-emphasis text-slide-title leading-tight"
                style={{ fontWeight: "var(--font-weight-title)" }}
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-2" />
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
                const iconData = getIcon(card.icon);
                return (
                    <motion.div
                        key={i}
                        className="bg-surface-secondary p-card flex flex-col justify-center h-full border-card shadow-card hover:shadow-xl hover:border-border-strong transition-all duration-200 ease-out hover:scale-[1.02] rounded-card @container"
                        style={{ borderWidth: "var(--border-width-card)" }}
                        variants={slideUpItem(disableAnimation)}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center mb-4 shrink-0 border border-border-default/50",
                                isStrategy ? iconData.theme.bgClass : "bg-surface-muted"
                            )}
                            style={{
                                width: "clamp(32px, 10cqi, 48px)",
                                height: "clamp(32px, 10cqi, 48px)",
                                borderRadius: isStrategy ? "calc(var(--border-radius-card) * 0.6)" : "var(--border-radius-badge)"
                            }}
                        >
                            {!isStrategy ? (
                                <div className="text-text-muted">
                                    {iconData.element}
                                </div>
                            ) : iconData.element}
                        </div>
                        <p
                            className="font-bold text-text-primary text-card-title mb-2 leading-tight drop-shadow-sm"
                            style={{ fontWeight: "var(--font-weight-card-title)" }}
                        >
                            {card.title}
                        </p>
                        <p
                            className="text-text-secondary text-card-body leading-relaxed"
                        >
                            {card.body}
                        </p>
                    </motion.div>
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
            <LayoutSplit leftContent={left} rightContent={right} />
        </motion.div>
    );
}
