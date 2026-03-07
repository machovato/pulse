"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, CheckSquare, Info, MoreHorizontal, Clock, ClipboardX } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface BlockerItem {
    text: string;
    severity: "action" | "approval" | "fyi";
    owner?: string;
    due?: string;
    badges?: string[];
}

interface BlockersData {
    items: BlockerItem[];
}

const SEVERITY_CONFIG = {
    action: {
        borderClass: "border-badge-action-bg border-l-accent",
        badgeBg: "var(--badge-action-bg)",
        badgeText: "var(--badge-action-text)",
        label: "Action Required",
    },
    approval: {
        borderClass: "border-badge-approval-bg border-l-accent",
        badgeBg: "var(--badge-approval-bg)",
        badgeText: "var(--badge-approval-text)",
        label: "Approval",
    },
    fyi: {
        borderClass: "border-badge-fyi-bg border-l-accent",
        badgeBg: "var(--badge-fyi-bg)",
        badgeText: "var(--badge-fyi-text)",
        label: "FYI",
    },
};

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function BlockersSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide; deckMeta?: Record<string, string>; disableAnimation?: boolean }) {
    const data = (slide.data ?? { items: [] }) as unknown as BlockersData;
    const items = data.items ?? [];
    const meta = deckMeta ?? {};

    const actions = items.filter((i) => i.severity === "action").length;
    const approvals = items.filter((i) => i.severity === "approval").length;
    const fyis = items.filter((i) => i.severity === "fyi").length;

    const allFyi = items.length > 0 && items.every((i) => i.severity === "fyi");
    const panelTitle = allFyi ? "Updates & Notes" : slide.title || "Blockers & Asks";
    const leftBg = allFyi ? "navy" : "blue";

    const allClear = items.length === 0;

    const left = (
        <motion.div className="flex flex-col h-full relative" variants={slideUpItem(disableAnimation)}>
            <div className="flex flex-col gap-6 relative z-10 w-full pr-8">
                <div className="flex flex-col gap-2">
                    <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60 mb-1">
                        Blockers
                    </p>
                    <h2
                        className="font-bold text-text-on-emphasis leading-tight mt-0 mb-0 pt-0 text-slide-title"
                        style={{ fontWeight: "var(--font-weight-title)" }}
                    >
                        {panelTitle.split(' ').length > 2 ? panelTitle : (
                            <>
                                {panelTitle.split(' ')[0]}<br />
                                {panelTitle.split(' ').slice(1).join(' ')}
                            </>
                        )}
                    </h2>
                    <p className="text-text-on-emphasis opacity-90 text-slide-subtitle mt-4 leading-relaxed max-w-[90%]">
                        Current impediments requiring leadership attention or team coordination.
                    </p>
                </div>

                {!allClear && (
                    <div className="flex flex-col gap-4 mt-8">
                        {[
                            { label: "Actions Required", count: actions, icon: AlertCircle },
                            { label: "Approvals", count: approvals, icon: CheckSquare },
                            { label: "FYIs", count: fyis, icon: Info },
                        ].map(({ label, count, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between rounded-xl px-5 py-6 bg-white/10"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.15)"
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon className="w-5 h-5 text-text-on-emphasis" />
                                    <span
                                        className="font-semibold text-text-on-emphasis opacity-90 text-base"
                                    >
                                        {label}
                                    </span>
                                </div>
                                <span
                                    className="font-bold text-text-on-emphasis text-2xl"
                                >
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>


        </motion.div>
    );

    const right = allClear ? (
        <motion.div
            className="flex flex-col items-center justify-center gap-4 h-full text-center"
            variants={slideUpItem(disableAnimation)}
        >
            <CheckCircle2 className="w-14 h-14 text-accent-success" />
            <p className="text-xl font-semibold text-accent-success">No blockers. All clear.</p>
            <p className="text-sm text-text-secondary">The team is unblocked and moving forward.</p>
        </motion.div>
    ) : (
        <div className="flex flex-col h-full bg-surface-muted overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col gap-4 w-full overflow-y-auto px-slide pt-slide pb-8 relative z-10">
                {items.map((item, i) => {
                    const cfg = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.fyi;
                    return (
                        <motion.div
                            key={i}
                            className="bg-surface-secondary rounded-card shadow-card border border-border-default flex flex-col overflow-hidden"
                            variants={staggerContainer(disableAnimation)}
                        >
                            {/* Loud Priority Flag Header */}
                            <motion.div
                                className="w-full px-5 py-2.5 flex justify-between items-center border-b border-black/5"
                                style={{
                                    background: cfg.badgeBg,
                                    color: cfg.badgeText,
                                }}
                            >
                                <span className="font-extrabold uppercase tracking-widest text-[11px]">
                                    {cfg.label}
                                </span>
                                {item.severity === "action" && (
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <Clock className="w-3.5 h-3.5" strokeWidth={3} />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">High Priority</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Card Body */}
                            <motion.div className="p-5 flex flex-col gap-4" variants={slideUpItem(disableAnimation)}>
                                <p
                                    className="text-text-primary leading-snug text-card-title font-semibold"
                                    style={{ fontWeight: "var(--font-weight-card-title)" }}
                                >
                                    {item.text}
                                </p>

                                <div className="flex justify-between items-center mt-2 pt-4 border-t border-border-default/50 min-h-[40px]">
                                    {item.owner ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent-info flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                                                {getInitials(item.owner)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Owner</span>
                                                <span className="text-sm font-bold text-text-primary">{item.owner}</span>
                                            </div>
                                        </div>
                                    ) : <div />}

                                    {(item.severity === "fyi" || item.severity === "approval") && item.badges && item.badges.length > 0 && (
                                        <div className="flex items-center gap-1.5 text-text-muted bg-surface-muted px-2.5 py-1 rounded shadow-inner border border-border-default/50">
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{item.badges.join(" · ")}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}

                {items.length < 3 && items.length > 0 && (
                    <div className="border border-dashed border-border-muted rounded-card p-8 flex flex-col items-center justify-center gap-3 mt-4 min-h-[160px] bg-surface-muted" style={{ borderWidth: "var(--border-width-card)" }}>
                        <ClipboardX className="w-6 h-6 text-text-muted" />
                        <span className="text-text-secondary text-sm font-medium">No additional blockers reported</span>
                    </div>
                )}
            </div>


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
                leftBackground={leftBg}
                rightPadding={false}
                rightBg="bg-surface-muted"
            />
        </motion.div>
    );
}
