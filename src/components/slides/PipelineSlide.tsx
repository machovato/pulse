"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ChevronRight, AlertTriangle, Circle } from "lucide-react";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";

interface Step {
    label: string;
    icon?: string;
    status?: "done" | "current" | "next";
    badges?: string[];
    blockers?: string[];
}

interface PipelineData {
    steps: Step[];
}

function resolveIconFromLabel(label: string): React.ElementType {
    const lower = label.toLowerCase();
    if (lower.match(/triage|review|validate/)) return LucideIcons.ClipboardCheck;
    if (lower.match(/schema|metadata|architect/)) return LucideIcons.Layers;
    if (lower.match(/language|scope|international/)) return LucideIcons.Globe;
    if (lower.match(/convert|migrate|move/)) return LucideIcons.ArrowRightLeft;
    if (lower.match(/governance|policy|workflow/)) return LucideIcons.GitBranch;
    if (lower.match(/qa|test|quality/)) return LucideIcons.BadgeCheck;
    if (lower.match(/deliver|launch|release/)) return LucideIcons.Rocket;
    if (lower.match(/design|blueprint|template/)) return LucideIcons.PenTool;
    return Circle;
}

const STATUS_CONFIG = {
    done: {
        dotClass: "border-accent-success bg-accent-success text-surface-page",
        iconClass: "text-surface-page",
        labelClass: "text-accent-success font-semibold",
        statusText: "Done",
        statusClass: "text-accent-success",
    },
    current: {
        dotClass: "border-accent-info bg-accent-info text-surface-page shadow-md",
        iconClass: "text-surface-page",
        labelClass: "text-text-primary font-extrabold tracking-tight",
        statusText: "In Progress",
        statusClass: "text-accent-info font-bold",
    },
    next: {
        dotClass: "border-border-muted bg-surface-page text-border-muted",
        iconClass: "text-border-muted",
        labelClass: "text-text-secondary font-medium",
        statusText: "Up Next",
        statusClass: "text-text-muted",
    },
} as const;

export function PipelineSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? { steps: [] }) as unknown as PipelineData;
    const steps = data.steps ?? [];

    return (
        <LayoutWhite center={false}>
            <motion.p
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-info pt-10 pb-0 text-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                Pipeline
            </motion.p>

            <motion.h2
                className="font-bold text-text-primary text-center mb-0 mt-2"
                style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
            >
                {slide.title}
            </motion.h2>

            <div className="flex-1 flex items-center justify-center w-full px-12">
                <div className="flex items-start justify-center gap-0 w-full" style={{ maxWidth: "88%" }}>
                    {steps.map((step, i) => {
                        const status = step.status ?? "next";
                        const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.next;
                        let IconComponent = resolveIconFromLabel(step.label);
                        if (step.icon) {
                            const iconKey = step.icon.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
                            // @ts-expect-error - Dynamic lookup
                            if (LucideIcons[iconKey]) IconComponent = LucideIcons[iconKey];
                        }
                        const isLast = i === steps.length - 1;

                        return (
                            <div key={i} className="flex items-start flex-1 min-w-0">
                                <motion.div
                                    className="flex flex-col items-center gap-4 flex-1 px-4"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                                >
                                    <div
                                        className={`rounded-full flex items-center justify-center shadow-md relative ${status === "current" ? "pulse-ring-active" : ""} ${cfg.dotClass}`}
                                        style={{
                                            width: "clamp(64px, 7vw, 110px)",
                                            height: "clamp(64px, 7vw, 110px)",
                                            borderWidth: "clamp(4px, 0.4vw, 8px)"
                                        }}
                                    >
                                        <IconComponent className={`w-1/2 h-1/2 ${cfg.iconClass}`} strokeWidth={status === "current" ? 2.5 : 2} />
                                    </div>

                                    <span
                                        className={`text-center leading-tight mt-2 ${cfg.labelClass}`}
                                        style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}
                                    >
                                        {step.label}
                                    </span>

                                    <span
                                        className={`font-semibold uppercase tracking-wider ${cfg.statusClass}`}
                                        style={{ fontSize: "clamp(10px, 1vw, 14px)", marginTop: "-4px" }}
                                    >
                                        {cfg.statusText}
                                    </span>

                                    {status === "current" && (
                                        <div className="w-full max-w-[85%] h-1 mt-1 bg-surface-muted border border-border-default/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-accent-progress rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: "65%" }}
                                                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                            />
                                        </div>
                                    )}

                                    {step.badges && step.badges.length > 0 && (
                                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                                            {step.badges.map((b, bi) => (
                                                <span
                                                    key={bi}
                                                    className="bg-surface-muted text-accent-info border border-border-default font-semibold"
                                                    style={{
                                                        fontSize: "clamp(12px, 1.1vw, 16px)",
                                                        padding: "clamp(4px, 0.4vw, 8px) clamp(8px, 0.8vw, 16px)",
                                                        borderRadius: "clamp(4px, 0.4vw, 8px)"
                                                    }}
                                                >
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {step.blockers && step.blockers.length > 0 && (
                                        <div className="flex flex-col gap-2 w-full mt-3">
                                            {step.blockers.map((bl, bli) => (
                                                <div
                                                    key={bli}
                                                    className="flex items-start gap-2 bg-badge-action-bg"
                                                    style={{
                                                        border: "1px solid var(--accent-danger, #F0A0A8)",
                                                        padding: "clamp(6px, 0.6vw, 12px)",
                                                        borderRadius: "clamp(4px, 0.4vw, 8px)"
                                                    }}
                                                >
                                                    <AlertTriangle className="shrink-0 mt-0.5 text-accent-danger" style={{ width: "clamp(16px, 1.4vw, 24px)", height: "clamp(16px, 1.4vw, 24px)" }} />
                                                    <span
                                                        className="leading-tight font-medium text-badge-action-text"
                                                        style={{ fontSize: "clamp(13px, 1.2vw, 18px)" }}
                                                    >
                                                        {bl}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>

                                {!isLast && (
                                    <div
                                        className="flex items-center shrink-0"
                                        style={{
                                            paddingTop: "clamp(32px, 3.5vw, 55px)",
                                        }}
                                    >
                                        <div
                                            className="bg-border-default"
                                            style={{
                                                width: "clamp(24px, 4vw, 70px)",
                                                height: "clamp(4px, 0.4vw, 8px)"
                                            }}
                                        />
                                        <ChevronRight
                                            className="text-border-muted -ml-1.5"
                                            style={{
                                                width: "clamp(20px, 2vw, 36px)",
                                                height: "clamp(20px, 2vw, 36px)"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </LayoutWhite>
    );
}
