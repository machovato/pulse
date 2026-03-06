"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";

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

export function GridSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? { cards: [] }) as unknown as GridData;
    const cards = data.cards ?? [];
    const cols = cards.length <= 2 ? 1 : cards.length <= 4 ? 2 : 3;

    const left = (
        <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-on-emphasis opacity-60">
                Grid
            </p>
            <h2
                className="font-bold text-text-on-emphasis leading-tight"
                style={{ fontSize: "clamp(24px, 3vw, 42px)" }}
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-2" />
        </div>
    );

    const right = (
        <div
            className="grid w-full h-full"
            style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${Math.ceil(cards.length / cols)}, 1fr)`,
                gap: "clamp(16px, 2vw, 32px)"
            }}
        >
            {cards.map((card, i) => {
                const iconData = getIcon(card.icon);
                return (
                    <motion.div
                        key={i}
                        className="bg-surface-secondary p-6 md:p-8 flex flex-col justify-center h-full border-2 border-border-default/50 shadow-md hover:shadow-xl hover:border-border-strong transition-all duration-200 ease-out hover:scale-[1.02] @container"
                        style={{ borderRadius: "clamp(12px, 1.5vw, 24px)" }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                    >
                        <div
                            className={`flex items-center justify-center mb-4 shrink-0 border border-border-default/50 ${iconData.theme.bgClass}`}
                            style={{
                                width: "clamp(40px, 12cqi, 72px)",
                                height: "clamp(40px, 12cqi, 72px)",
                                borderRadius: "clamp(8px, 2.5cqi, 16px)"
                            }}
                        >
                            {iconData.element}
                        </div>
                        <p
                            className="font-extrabold text-text-primary mb-2 leading-tight drop-shadow-sm"
                            style={{ fontSize: "clamp(18px, 7.5cqi, 36px)", letterSpacing: "-0.01em" }}
                        >
                            {card.title}
                        </p>
                        <p
                            className="text-text-secondary leading-relaxed"
                            style={{ fontSize: "clamp(13px, 4.5cqi, 20px)" }}
                        >
                            {card.body}
                        </p>
                    </motion.div>
                );
            })}
        </div>
    );

    return <LayoutSplit leftContent={left} rightContent={right} />;
}
