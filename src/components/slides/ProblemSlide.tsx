"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutSplitPrimarySecondary } from "./layouts/LayoutSplitPrimarySecondary";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";
import { Typography } from "../ui/Typography";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);


const ACCENT_SEQUENCE = ["info", "success", "warning", "danger"] as const;
type AccentType = typeof ACCENT_SEQUENCE[number];

const ACCENT_CLASSES: Record<AccentType, { text: string; bg: string }> = {
    info: { text: "text-accent-info", bg: "bg-accent-info/10" },
    success: { text: "text-accent-success", bg: "bg-accent-success/10" },
    warning: { text: "text-accent-warning", bg: "bg-accent-warning/10" },
    danger: { text: "text-accent-danger", bg: "bg-accent-danger/10" }
};

const KICKOFF_COLORS = [
    { text: "text-emerald-600", bg: "bg-emerald-50 text-emerald-600" },
    { text: "text-indigo-600", bg: "bg-indigo-50 text-indigo-600" },
    { text: "text-amber-600", bg: "bg-amber-50 text-amber-600" },
    { text: "text-rose-600", bg: "bg-rose-50 text-rose-600" },
    { text: "text-teal-600", bg: "bg-teal-50 text-teal-600" },
    { text: "text-violet-600", bg: "bg-violet-50 text-violet-600" },
];

interface ProblemItem {
    title: string;
    body: string;
    icon?: string;
    severity: "critical" | "high" | "moderate";
}

interface ProblemData {
    primary?: ProblemItem;
    secondary?: ProblemItem[];
}

function getLucideIcon(name?: string, className?: string) {
    if (!name) return <CircleDot className={className || "w-5 h-5 text-gray-400"} />;
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
    if (!IconComponent) return <CircleDot className={className || "w-5 h-5 text-text-muted"} />;
    return <IconComponent className={className || "w-5 h-5"} />;
}

function getBadgeProps(severity: string) {
    switch (severity) {
        case "critical": return "bg-accent-danger text-surface-page";
        case "high": return "bg-accent-warning text-text-primary";
        case "moderate": return "bg-border-muted text-text-primary";
        default: return "bg-border-muted text-text-primary";
    }
}

function getBorderColor(severity: string) {
    switch (severity) {
        case "critical": return "border-l-accent-danger";
        case "high": return "border-l-accent-warning";
        case "moderate": return "border-l-border-muted";
        default: return "border-l-border-muted";
    }
}

export function ProblemSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const isKickoff = template === "kickoff";
    const data = (slide.data ?? {}) as unknown as ProblemData;
    const primary = data.primary;
    const secondary = data.secondary ?? [];

    const leftNode = primary ? (
        <motion.div
            className={cn(
                "w-full h-full flex flex-col pt-8 px-8 pb-10 rounded-card bg-surface-primary border-card border-l-accent relative justify-start shadow-xl",
                !isKickoff && "dark-surface",
                getBorderColor(primary.severity)
            )}
            style={{
                borderWidth: "var(--border-width-card)",
                borderLeftWidth: "var(--border-width-accent)"
            }}
            variants={slideUpItem(disableAnimation)}
        >
            <div
                className={cn("flex flex-col h-full w-full", !isKickoff && "dark-surface")}
            >
                <div className="mb-8 flex justify-between items-start">
                    <Typography variant="badge" className={cn("px-3 py-1 rounded-badge", getBadgeProps(primary.severity))}>
                        {primary.severity} Focus
                    </Typography>
                    <div className="p-3 bg-white/10 Backdrop-blur-sm rounded-xl border border-white/20">
                        {getLucideIcon(primary.icon, "w-8 h-8 text-surface-page")}
                    </div>
                </div>
                <Typography as="h3" variant="h1" className="mb-6 leading-[1.05] drop-shadow-sm pr-4 !text-text-primary">
                    {primary.title}
                </Typography>
                <Typography variant="subtitle" className="opacity-90 max-w-xl mt-auto line-clamp-none">
                    {primary.body}
                </Typography>
            </div>
        </motion.div>
    ) : null;

    const rightNode = secondary.length > 0 ? (
        <>
            {secondary.map((item, i) => {
                // Scale padding and text size slightly based on how many cards there are
                const isDense = secondary.length > 3;

                const iconAccent = ACCENT_SEQUENCE[i % ACCENT_SEQUENCE.length];
                const classes = isKickoff
                    ? KICKOFF_COLORS[i % KICKOFF_COLORS.length]
                    : ACCENT_CLASSES[iconAccent as AccentType];

                return (
                    <MotionCard
                        key={i}
                        accent={
                            item.severity === "critical" ? "danger" :
                                template === "kickoff" ? "info" :
                                    item.severity === "high" ? "warning" :
                                        "neutral"
                        }
                        className={cn(
                            "flex-1 w-full bg-surface-muted shadow-sm flex flex-row items-center gap-5",
                            isDense ? "p-4" : "p-card"
                        )}
                        variants={slideUpItem(disableAnimation)}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center shrink-0 rounded-full",
                                classes.bg
                            )}
                            style={{
                                width: isDense ? "clamp(36px, 8cqi, 48px)" : "clamp(48px, 12cqi, 64px)",
                                height: isDense ? "clamp(36px, 8cqi, 48px)" : "clamp(48px, 12cqi, 64px)",
                            }}
                        >
                            {getLucideIcon(item.icon, cn(classes.text, isDense ? "w-5 h-5" : "w-7 h-7"))}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                <Typography as="h4" variant="h2" className={cn("truncate font-bold", isDense && "text-lg")}>
                                    {item.title}
                                </Typography>
                                <Typography variant="eyebrow" className={cn("px-2 py-0.5 rounded-badge shrink-0 w-fit", getBadgeProps(item.severity))}>
                                    {item.severity}
                                </Typography>
                            </div>
                            <Typography variant="body" className="line-clamp-3">
                                {item.body}
                            </Typography>
                        </div>
                    </MotionCard>
                );
            })}
        </>
    ) : null;

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutSplitPrimarySecondary
                eyebrow="Problem Space"
                title={slide.title}
                leftNode={leftNode}
                rightNode={rightNode}
                disableAnimation={disableAnimation}
            />
        </motion.div>
    );
}
