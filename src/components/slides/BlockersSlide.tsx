"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, CheckSquare, Info, MoreHorizontal, Clock, ClipboardX } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);

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

const SEVERITY_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    action: {
        bg: "var(--accent-danger)",
        text: "#ffffff",
        label: "Action Required",
    },
    approval: {
        bg: "var(--accent-warning)",
        text: "#ffffff",
        label: "Approval",
    },
    fyi: {
        bg: "var(--text-muted)",
        text: "#ffffff",
        label: "FYI",
    },
};

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function BlockersSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide; deckMeta?: Record<string, string>; disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const isKickoff = template === "kickoff";
    const data = (slide.data ?? { items: [] }) as unknown as BlockersData;
    const items = data.items ?? [];
    const meta = deckMeta ?? {};

    const actions = items.filter((i) => i.severity === "action").length;
    const approvals = items.filter((i) => i.severity === "approval").length;
    const fyis = items.filter((i) => i.severity === "fyi").length;

    const allFyi = items.length > 0 && items.every((i) => i.severity === "fyi");
    const panelTitle = slide.title || (allFyi ? "Updates & Notes" : "Blockers & Asks");
    const leftBg = allFyi ? "navy" : "blue";

    const allClear = items.length === 0;

    const left = (
        <motion.div
            className={cn("flex flex-col h-full relative justify-center", !isKickoff && "dark-surface")}
            variants={slideUpItem(disableAnimation)}
        >
            <div className="flex flex-col gap-6 relative z-10 w-full pr-8">
                <div className="flex flex-col gap-2">
                    <SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="text-accent-info mb-1" />
                    <Typography
                        as="h2"
                        variant="h1"
                        className="text-text-on-emphasis leading-tight mt-0 mb-0 pt-0"
                    >
                        {panelTitle.split(' ').length > 2 ? panelTitle : (
                            <>
                                {panelTitle.split(' ')[0]}<br />
                                {panelTitle.split(' ').slice(1).join(' ')}
                            </>
                        )}
                    </Typography>
                    <Typography 
                        variant="subtitle" 
                        className={cn(
                            "opacity-90 mt-4 leading-relaxed max-w-[90%]",
                            isKickoff ? "text-text-secondary" : "text-text-on-emphasis"
                        )}
                    >
                        Current impediments requiring leadership attention or team coordination.
                    </Typography>
                </div>

                {!allClear && (
                    <div className="flex flex-col gap-3 mt-8 max-w-sm">
                        {[
                            { label: "Actions Required", count: actions, icon: AlertCircle, colorClass: "text-accent-danger", borderClass: isKickoff ? "border-accent-danger/30" : "border-accent-danger/50", bgClass: isKickoff ? "bg-white shadow-sm" : "bg-accent-danger/15" },
                            { label: "Approvals", count: approvals, icon: CheckSquare, colorClass: "text-accent-warning", borderClass: isKickoff ? "border-accent-warning/40" : "border-accent-warning/50", bgClass: isKickoff ? "bg-white shadow-sm" : "bg-accent-warning/15" },
                            { label: "FYIs", count: fyis, icon: Info, colorClass: isKickoff ? "text-text-secondary" : "text-text-muted", borderClass: isKickoff ? "border-border-muted" : "border-text-muted/50", bgClass: isKickoff ? "bg-white shadow-sm" : "bg-text-muted/15" },
                        ].map(({ label, count, icon: Icon, colorClass, borderClass, bgClass }) => (
                            <div
                                key={label}
                                className={cn(
                                    "flex items-center justify-between rounded-full px-5 py-2.5 border backdrop-blur-sm",
                                    borderClass,
                                    bgClass
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn("w-4 h-4", colorClass)} strokeWidth={2.5} />
                                    <Typography
                                        variant="caption"
                                        className={cn("font-bold uppercase tracking-wider", isKickoff ? "text-text-secondary" : "text-white")}
                                    >
                                        {label}
                                    </Typography>
                                </div>
                                <Typography
                                    variant="body"
                                    className={cn("font-black", isKickoff ? "text-text-primary" : "text-white")}
                                >
                                    {count}
                                </Typography>
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
                        <MotionCard
                            key={i}
                            accent="none"
                            className="flex flex-col w-full shadow-md transition-shadow hover:shadow-lg"
                            style={{
                                borderLeftWidth: "var(--border-width-accent)",
                                borderLeftColor: cfg.bg,
                            }}
                            variants={slideUpItem(disableAnimation)}
                        >
                            <div className="flex justify-between items-start w-full mb-3">
                                <Typography
                                    variant="badge"
                                    className="px-3 py-1.5 rounded shadow-sm uppercase tracking-wider font-bold"
                                    style={{ background: cfg.bg, color: cfg.text }}
                                >
                                    {cfg.label}
                                </Typography>

                                {item.severity === "action" && (
                                    <div className="flex items-center gap-1.5 opacity-90 text-accent-danger mt-1">
                                        <Clock className="w-4 h-4" strokeWidth={3} />
                                        <span className="text-[11px] uppercase font-bold tracking-wider text-text-primary">High Priority</span>
                                    </div>
                                )}
                            </div>

                            <Typography
                                variant="h2"
                                className="text-text-primary leading-relaxed mt-1 flex-1"
                            >
                                {item.text}
                            </Typography>

                            <div className="flex justify-between items-end mt-4 pt-4 border-t border-border-default/50 min-h-[40px]">
                                {item.owner ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-accent-info flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                                            {getInitials(item.owner)}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <Typography variant="caption" className="uppercase tracking-[0.2em] font-bold opacity-60 text-[10px]">Owner</Typography>
                                            <Typography variant="body" className="font-bold text-text-primary leading-none mt-0.5">{item.owner}</Typography>
                                        </div>
                                    </div>
                                ) : <div />}

                                {(item.severity === "fyi" || item.severity === "approval") && item.badges && item.badges.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-text-secondary bg-surface-muted px-3 py-1.5 rounded shadow-inner border border-border-default/50">
                                        <Typography variant="badge">{item.badges.join(" · ")}</Typography>
                                    </div>
                                )}
                            </div>
                        </MotionCard>
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
