"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";

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
    proposed: { bg: "var(--surface-muted)", text: "var(--text-primary)", border: "var(--border-muted)", label: "Proposed" },
    approved: { bg: "var(--surface-secondary)", text: "var(--accent-success)", border: "var(--accent-success)", label: "Approved" },
    blocked: { bg: "var(--badge-action-bg)", text: "var(--badge-action-text)", border: "var(--accent-danger)", label: "Blocked" },
    done: { bg: "var(--surface-muted)", text: "var(--text-muted)", border: "var(--border-muted)", label: "Done" },
};

export function DecisionLogSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const data = (slide.data ?? { items: [] }) as unknown as DecisionLogData;
    const items = data.items ?? [];

    const left = (
        <motion.div className="flex flex-col gap-4" variants={slideUpItem(disableAnimation)}>
            <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60">
                Decision Log
            </p>
            <h2
                className="font-bold text-text-on-emphasis leading-tight"
                style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-2" />
            <p className="text-text-on-emphasis opacity-55 text-xs mt-1">
                {items.length} decision{items.length !== 1 ? "s" : ""} recorded
            </p>
        </motion.div>
    );

    const right = (
        <div className="w-full h-full flex flex-col justify-center">
            <motion.div
                className="w-full bg-surface-muted rounded-card border border-border-default shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]"
                variants={staggerContainer(disableAnimation)}
            >
                <div className="px-8 py-6 flex-1 overflow-y-auto w-full">
                    {/* Header row - Ledger Style */}
                    <motion.div className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr] gap-6 pb-4 border-b-2 border-border-default mb-2" variants={slideUpItem(disableAnimation)}>
                        {["Decision", "Owner", "Date", "Status"].map((h) => (
                            <div
                                key={h}
                                className={cn(
                                    "font-bold uppercase tracking-[0.15em] text-text-muted text-[11px]",
                                    h === "Status" && "text-right"
                                )}
                            >
                                {h}
                            </div>
                        ))}
                    </motion.div>

                    {/* Rows */}
                    <div className="flex flex-col w-full">
                        {items.map((item, i) => {
                            const cfg = STATUS_CONFIG[item.status ?? "proposed"];
                            return (
                                <motion.div
                                    key={i}
                                    className="grid grid-cols-[1fr_2fr_1.5fr_1.5fr] gap-6 py-5 border-b border-border-default/40 last:border-0 items-center w-full group hover:bg-black/[0.02] transition-colors px-2 -mx-2 rounded"
                                    variants={slideUpItem(disableAnimation)}
                                >
                                    <p
                                        className="text-text-primary font-bold leading-snug text-sm max-w-[280px]"
                                    >
                                        {item.decision}
                                    </p>
                                    <span
                                        className="text-text-secondary whitespace-nowrap text-sm font-medium"
                                    >
                                        {item.owner ?? "—"}
                                    </span>
                                    <span
                                        className="text-text-muted whitespace-nowrap text-sm font-medium"
                                    >
                                        {item.date ?? "—"}
                                    </span>
                                    <div className="flex justify-end w-full">
                                        <span
                                            className="font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-sm whitespace-nowrap border-2 text-[10px] shadow-sm transform group-hover:-translate-y-0.5 transition-transform"
                                            style={{
                                                background: cfg.bg,
                                                color: cfg.text,
                                                borderColor: cfg.border,
                                            }}
                                        >
                                            {cfg.label}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
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
