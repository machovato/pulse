"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot, CheckCircle2 } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";
import { useTemplate } from "@/components/TemplateContext";

import { SlideBackgroundIcon } from "./SlideBackgroundIcon";

interface ContextItem {
    title: string;
    body: string;
    icon?: string;
    status: "confirmed" | "in-progress" | "pending";
}

interface ContextData {
    items: ContextItem[];
}

function getLucideIcon(name?: string, className?: string) {
    if (!name) return <CircleDot className={className || "w-5 h-5 text-gray-400"} />;
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
    if (!IconComponent) return <CircleDot className={className || "w-5 h-5 text-text-muted"} />;
    return <IconComponent className={className || "w-5 h-5"} />;
}

export function ContextSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide, deckMeta?: Record<string, string>, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { items: [] }) as unknown as ContextData;
    const items = data.items ?? [];

    const isKickoff = template === "kickoff";
    const isSuccessCriteria = isKickoff && slide.title === "How We Measure Success";

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutWhite center={false}>
                <SlideBackgroundIcon title={slide.title} position="bottom-left" />
                <div className="w-full flex-1 flex flex-col justify-start py-12 px-slide relative z-10">
                    <div className="w-full mb-8 shrink-0">
                        <motion.div variants={slideUpItem(disableAnimation)}>
                            <SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="text-accent-info opacity-60 mb-2" />
                            <Typography as="h2" variant="h1" className="leading-tight mt-0 pt-0">
                                {slide.title}
                            </Typography>
                        </motion.div>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto px-4 pb-8 relative z-10" style={{ maxHeight: "calc(100vh - 180px)" }}>
                        <div className="flex flex-col gap-3.5 max-w-6xl w-full mx-auto py-2">
                            {items.map((item, i) => {
                                const CRITERIA_COLORS = [
                                    { text: "text-emerald-600", bg: "bg-emerald-50" },
                                    { text: "text-indigo-600", bg: "bg-indigo-50" },
                                    { text: "text-amber-600", bg: "bg-amber-50" },
                                    { text: "text-rose-600", bg: "bg-rose-50" },
                                    { text: "text-teal-600", bg: "bg-teal-50" },
                                    { text: "text-violet-600", bg: "bg-violet-50" },
                                ];
                                const criteriaColor = CRITERIA_COLORS[i % CRITERIA_COLORS.length];

                                return (
                                    <motion.div
                                        key={i}
                                        className={cn(
                                            "flex items-center gap-6 px-6 py-4 md:py-6 rounded-card transition-all shadow-md",
                                            isSuccessCriteria
                                                ? "relative"
                                                : cn("border-border-default bg-surface-primary", !isKickoff && "dark-surface")
                                        )}
                                        style={isSuccessCriteria ? {
                                            background: "var(--surface-secondary)",
                                            border: "var(--border-width-card) solid var(--border-default)",
                                            borderTop: "var(--border-width-accent) solid var(--accent-info)",
                                            borderRadius: "var(--border-radius-card)",
                                        } : {
                                            borderWidth: "var(--border-width-card)",
                                            borderLeftWidth: "var(--border-width-accent)",
                                        }}
                                        variants={slideUpItem(disableAnimation)}
                                    >
                                        {isSuccessCriteria && (
                                            <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-emerald-500" />
                                        )}
                                        <div className={cn(
                                            "shrink-0 flex items-center justify-center shadow-sm border",
                                            isSuccessCriteria
                                                ? cn("w-14 h-14 rounded-full border-transparent", criteriaColor.bg)
                                                : cn("p-3 rounded-xl", isKickoff ? "bg-white border-transparent" : "bg-white/10 backdrop-blur-sm border-white/20")
                                        )}>
                                            {getLucideIcon(item.icon, cn(
                                                "w-7 h-7",
                                                isSuccessCriteria
                                                    ? criteriaColor.text
                                                    : isKickoff ? "text-accent-info" : "text-white"
                                            ))}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <Typography as="h3" variant="h2" className={cn("leading-tight mb-2", isKickoff ? "text-text-primary" : "text-white")}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body" className={cn("max-w-4xl", isKickoff ? "text-text-secondary" : "text-white/90")}>
                                                {item.body}
                                            </Typography>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
