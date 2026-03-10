"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";
import type { LooseSlide } from "@/lib/schema";
import { Typography } from "../ui/Typography";

interface AgendaItem {
    topic: string;
    time?: string;
    owner?: string;
}

interface AgendaData {
    items: AgendaItem[];
}

export function AgendaSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const isKickoff = template === "kickoff";
    const data = (slide.data ?? { items: [] }) as unknown as AgendaData;
    const items = data.items ?? [];

    const left = (
        <motion.div
            className={cn("flex flex-col gap-4", !isKickoff && "dark-surface")}
            variants={slideUpItem(disableAnimation)}
        >
            <Typography variant="eyebrow" className="text-text-on-emphasis mb-1">
                Agenda
            </Typography>
            <Typography as="h2" variant="h1" className="leading-tight mt-0 mb-0 pt-0">
                {slide.title}
            </Typography>
            <div className="w-8 h-0.5 bg-white opacity-30 mt-2" />
            {items.length > 0 && (
                <Typography variant="caption" className="opacity-70 mt-1">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                </Typography>
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
                        <Typography variant="h2" className="leading-tight">
                            {item.topic}
                        </Typography>
                        <div className="flex gap-4 mt-2 flex-wrap items-center">
                            {item.time && (
                                <Typography
                                    variant="badge"
                                    className="text-accent-info bg-surface-muted px-2 py-0.5 rounded border border-border-default/50"
                                >
                                    {item.time}
                                </Typography>
                            )}
                            {item.owner && (
                                <Typography variant="caption" className="font-semibold">
                                    {item.owner}
                                </Typography>
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
