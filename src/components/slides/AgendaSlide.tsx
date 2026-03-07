"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";

interface AgendaItem {
    topic: string;
    time?: string;
    owner?: string;
}

interface AgendaData {
    items: AgendaItem[];
}

export function AgendaSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? { items: [] }) as unknown as AgendaData;
    const items = data.items ?? [];

    const left = (
        <motion.div className="flex flex-col gap-4" variants={slideUpItem(disableAnimation)}>
            <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60">
                Agenda
            </p>
            <h2
                className="font-bold text-text-on-emphasis leading-tight"
                style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }}
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-2" />
            {items.length > 0 && (
                <p className="text-text-on-emphasis opacity-50 text-sm mt-1">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                </p>
            )}
        </motion.div>
    );

    const right = (
        // @container allows children to scale based on this panel's width
        <div className="flex flex-col h-full justify-between py-2 w-full @container">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    className="flex items-center gap-5 flex-1"
                    style={{
                        // Proportional padding between items — not fixed px value
                        paddingTop: "clamp(6px, 0.8vh, 14px)",
                        paddingBottom: "clamp(6px, 0.8vh, 14px)",
                        borderBottom: i < items.length - 1
                            ? "1px solid var(--border-default)"
                            : "none",
                    }}
                    variants={slideUpItem(disableAnimation)}
                >
                    {/* Number badge — sized for presentation readability */}
                    <div
                        className="rounded-full bg-accent-info flex items-center justify-center shrink-0 text-surface-page font-bold"
                        style={{
                            width: "clamp(32px, 6cqi, 48px)",
                            height: "clamp(32px, 6cqi, 48px)",
                            fontSize: "clamp(12px, 2.2cqi, 18px)",
                        }}
                    >
                        {i + 1}
                    </div>

                    {/* Topic + meta */}
                    <div className="flex-1 min-w-0">
                        <p
                            className="font-bold text-text-primary leading-tight"
                            style={{ fontSize: "clamp(16px, 3.2cqi, 28px)" }}
                        >
                            {item.topic}
                        </p>
                        <div className="flex gap-4 mt-2 flex-wrap items-center">
                            {item.time && (
                                <span
                                    className="text-accent-info font-bold bg-surface-muted border border-border-default rounded"
                                    style={{
                                        fontSize: "clamp(11px, 1.8cqi, 16px)",
                                        padding: "clamp(2px, 0.4cqi, 4px) clamp(6px, 1cqi, 12px)"
                                    }}
                                >
                                    {item.time}
                                </span>
                            )}
                            {item.owner && (
                                <span
                                    className="text-text-secondary font-semibold"
                                    style={{ fontSize: "clamp(12px, 1.8cqi, 16px)" }}
                                >
                                    {item.owner}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
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
