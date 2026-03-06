"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, CheckSquare, Info, MoreHorizontal, Clock, ClipboardX } from "lucide-react";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";

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
        borderClass: "border-badge-action-bg border-l-[8px]",
        badgeBg: "var(--badge-action-bg)",
        badgeText: "var(--badge-action-text)",
        label: "Action Required",
    },
    approval: {
        borderClass: "border-badge-approval-bg border-l-[8px]",
        badgeBg: "var(--badge-approval-bg)",
        badgeText: "var(--badge-approval-text)",
        label: "Approval",
    },
    fyi: {
        borderClass: "border-badge-fyi-bg border-l-[8px]",
        badgeBg: "var(--badge-fyi-bg)",
        badgeText: "var(--badge-fyi-text)",
        label: "FYI",
    },
};

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function BlockersSlide({ slide, deckMeta }: { slide: LooseSlide; deckMeta?: Record<string, string> }) {
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
        <div className="flex flex-col h-full relative">
            <div className="flex flex-col gap-6 relative z-10 w-full pr-8">
                <div className="flex flex-col gap-2">
                    <h2
                        className="font-bold text-text-on-emphasis leading-tight mt-0 mb-0 pt-0"
                        style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
                    >
                        {panelTitle.split(' ').length > 2 ? panelTitle : (
                            <>
                                {panelTitle.split(' ')[0]}<br />
                                {panelTitle.split(' ').slice(1).join(' ')}
                            </>
                        )}
                    </h2>
                    <p className="text-text-on-emphasis opacity-90 text-sm mt-4 leading-relaxed max-w-[90%]" style={{ fontSize: "clamp(16px, 1.8vw, 20px)" }}>
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
                                        className="font-medium text-text-on-emphasis opacity-80"
                                        style={{ fontSize: "clamp(14px, 1.5vw, 18px)" }}
                                    >
                                        {label}
                                    </span>
                                </div>
                                <span
                                    className="font-bold text-text-on-emphasis"
                                    style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}
                                >
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {meta.subtitle && (
                <div className="absolute bottom-0 left-0 w-full pt-8 flex gap-4 text-text-on-emphasis opacity-50 text-sm">
                    <span>Update: {meta.subtitle}</span>
                </div>
            )}
        </div>
    );

    const right = allClear ? (
        <motion.div
            className="flex flex-col items-center justify-center gap-4 h-full text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
        >
            <CheckCircle2 className="w-14 h-14 text-accent-success" />
            <p className="text-xl font-semibold text-accent-success">No blockers. All clear.</p>
            <p className="text-sm text-text-secondary">The team is unblocked and moving forward.</p>
        </motion.div>
    ) : (
        <div className="flex flex-col h-full bg-surface-muted overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col gap-4 w-full overflow-y-auto px-[clamp(24px,4vw,64px)] pt-[clamp(24px,4vw,64px)] pb-8 relative z-10">
                {items.map((item, i) => {
                    const cfg = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.fyi;
                    return (
                        <motion.div
                            key={i}
                            className={`bg-surface-secondary rounded-2xl shadow-md border border-border-default ${cfg.borderClass}`}
                            style={{
                                padding: "clamp(20px, 3vw, 32px)"
                            }}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span
                                    className="font-bold uppercase tracking-wider rounded-full px-3 py-1"
                                    style={{
                                        background: cfg.badgeBg,
                                        color: cfg.badgeText,
                                        fontSize: "clamp(10px, 1vw, 12px)",
                                    }}
                                >
                                    {cfg.label}
                                </span>
                                <MoreHorizontal className="w-5 h-5 text-text-muted" />
                            </div>

                            <p
                                className={`text-text-primary leading-tight mt-1 ${item.severity === "action" ? "font-bold" : "font-semibold"}`}
                                style={{ fontSize: "clamp(20px, 2.2vw, 32px)" }}
                            >
                                {item.text}
                            </p>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-default min-h-[40px]">
                                {item.owner ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-accent-info flex items-center justify-center text-text-on-emphasis text-xs font-bold shrink-0">
                                            {getInitials(item.owner)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Owner</span>
                                            <span className="text-sm font-bold text-text-primary">{item.owner}</span>
                                        </div>
                                    </div>
                                ) : <div />}

                                {item.severity === "action" && (
                                    <div className="flex items-center gap-1.5 text-accent-danger">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-bold">High Priority</span>
                                    </div>
                                )}
                                {(item.severity === "fyi" || item.severity === "approval") && item.badges && item.badges.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-text-muted">
                                        <span className="text-sm font-semibold">{item.badges.join(" · ")}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {items.length < 3 && items.length > 0 && (
                    <div className="border border-dashed border-border-muted rounded-xl p-8 flex flex-col items-center justify-center gap-3 mt-4 min-h-[160px] bg-surface-muted">
                        <ClipboardX className="w-6 h-6 text-text-muted" />
                        <span className="text-text-secondary text-sm font-medium">No additional blockers reported</span>
                    </div>
                )}
            </div>

            <div className="h-[80px] bg-surface-muted border-t border-border-default px-[clamp(24px,4vw,64px)] flex items-center justify-between shrink-0">
                <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold">Active Sprint</span>
                    <span className="text-sm font-bold text-text-primary">{meta.subtitle || "Sprint Phase"}</span>
                </div>
            </div>
        </div>
    );

    return (
        <LayoutSplit
            leftContent={left}
            rightContent={right}
            leftBackground={leftBg}
            rightPadding={false}
            rightBg="bg-surface-muted"
        />
    );
}
