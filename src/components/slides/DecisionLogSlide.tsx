"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "../ui/Typography";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);

interface DecisionItem {
    decision: string;
    owner?: string;
    date?: string;
    status?: "proposed" | "approved" | "blocked" | "done";
}

interface DecisionLogData {
    items: DecisionItem[];
}

// approved  = DTN Green       #4CB944 — yes, decided, positive
// blocked    = DTN Red         #C8192B — held up, escalation needed
// proposed   = DTN Teal        #007074 — pending decision, informational
// done       = DTN Dark Green  #005741 — archived/complete (historical)
const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
    proposed: { bg: "var(--surface-muted)", text: "var(--text-secondary)", border: "var(--border-muted)", label: "Proposed" },
    approved: { bg: "var(--accent-success)", text: "#ffffff", border: "var(--accent-success)", label: "Approved" },
    blocked: { bg: "var(--accent-danger)", text: "#ffffff", border: "var(--accent-danger)", label: "Blocked" },
    done: { bg: "var(--text-muted)", text: "#ffffff", border: "var(--text-muted)", label: "Done" },
};

export function DecisionLogSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const isKickoff = template === "kickoff";
    const data = (slide.data ?? { decisions: [] }) as unknown as DecisionLogData;
    const items = data.items ?? [];

    const left = (
        <motion.div
            className={cn("flex flex-col gap-4", !isKickoff && "dark-surface")}
            variants={slideUpItem(disableAnimation)}
        >
            <Typography variant="eyebrow" className="text-text-on-emphasis opacity-60">
                Decision Log
            </Typography>
            <Typography as="h2" variant="h1" className="leading-tight mt-0 pt-0 mb-0">
                {slide.title}
            </Typography>
            <div className="w-8 h-0.5 bg-white opacity-30 mt-2" />
            <Typography variant="caption" className="opacity-55 mt-1">
                {items.length} decision{items.length !== 1 ? "s" : ""} recorded
            </Typography>
        </motion.div>
    );

    const right = (
        <div className="w-full h-full flex flex-col justify-center items-start overflow-hidden">
            <MotionCard
                accent="none"
                className="w-full overflow-hidden flex flex-col max-h-[600px] p-0 shadow-lg border border-border-default/50"
                style={{ padding: 0 }}
                variants={staggerContainer(disableAnimation)}
            >
                <div className="flex flex-col w-full h-full overflow-hidden">
                    {/* Header row - DTN Gradient Style */}
                    <motion.div className="sticky top-0 z-10 grid grid-cols-[2.5fr_1fr_1fr_1fr] gap-6 px-8 py-3.5 bg-gradient-to-r from-[var(--surface-primary)] to-[var(--surface-split)] border-b border-[var(--border-default)] shadow-md" variants={slideUpItem(disableAnimation)}>
                        {["Decision", "Owner", "Date", "Status"].map((h) => (
                            <Typography
                                key={h}
                                variant="caption"
                                className={cn(
                                    "font-bold uppercase tracking-[0.1em] text-white",
                                    h === "Status" && "text-right"
                                )}
                                style={{ color: "#ffffff" }}
                            >
                                {h}
                            </Typography>
                        ))}
                    </motion.div>

                    {/* Rows */}
                    <div className="flex flex-col w-full overflow-y-auto pb-4">
                        {items.map((item, i) => {
                            const cfg = STATUS_CONFIG[item.status ?? "proposed"];
                            return (
                                <motion.div
                                    key={i}
                                    className="relative grid grid-cols-[2.5fr_1fr_1fr_1fr] gap-6 py-4 px-8 border-b border-border-default/50 last:border-b-0 items-center w-full group hover:bg-black/[0.02] transition-colors overflow-hidden"
                                    variants={slideUpItem(disableAnimation)}
                                >
                                    {/* Left Status Border */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" style={{ backgroundColor: cfg.border }} />

                                    <Typography
                                        variant="body"
                                        className="leading-snug font-semibold text-text-primary pr-4"
                                    >
                                        {item.decision}
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="whitespace-nowrap"
                                    >
                                        {item.owner ?? "—"}
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        className="text-text-muted whitespace-nowrap"
                                    >
                                        {item.date ?? "—"}
                                    </Typography>
                                    <div className="flex justify-end w-full">
                                        <Typography
                                            variant="badge"
                                            className="px-3 py-1.5 rounded whitespace-nowrap shadow-sm border border-black/10 transition-transform font-bold tracking-wide"
                                            style={{
                                                background: cfg.bg,
                                                color: cfg.text,
                                            }}
                                        >
                                            {cfg.label}
                                        </Typography>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </MotionCard>
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
