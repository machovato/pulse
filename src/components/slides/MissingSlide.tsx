"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot, Keyboard } from "lucide-react";
import { slideUpItem, staggerContainer } from "@/lib/motion";
import type { LooseSlide } from "@/lib/schema";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";
import { cn } from "@/lib/utils";

/** Map known slide types to semantic icons for the placeholder */
const TYPE_ICONS: Record<string, string> = {
    hero: "Home",
    kpis: "BarChart3",
    pipeline: "GitMerge",
    grid: "LayoutGrid",
    timeline: "CalendarClock",
    roadmap: "Map",
    blockers: "ShieldAlert",
    callout: "Quote",
    agenda: "ListTodo",
    decision_log: "Gavel",
    context: "BookOpen",
    problem: "Target",
    evidence: "Search",
    framework: "Workflow",
};

export function MissingSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide, deckMeta?: Record<string, string>, disableAnimation?: boolean }) {
    
    // Resolve which icon to use
    const iconName = TYPE_ICONS[slide.type] || "FileQuestion";
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[iconName] || CircleDot;

    return (
        <motion.div
            className="w-full h-full flex items-center justify-center p-12"
            variants={staggerContainer(disableAnimation)}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="relative w-full max-w-2xl flex flex-col items-center justify-center text-center px-12 py-16 rounded-3xl border-2 border-dashed"
                style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                }}
                variants={slideUpItem(disableAnimation)}
            >
                {/* Eyebrow */}
                <div className="absolute top-6 left-8">
                    <SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="opacity-30" />
                </div>

                {/* Icon in dashed ring */}
                <div
                    className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-dashed mb-6"
                    style={{ borderColor: "rgba(255,255,255,0.15)" }}
                >
                    <IconComponent className="w-9 h-9 opacity-30" style={{ color: "rgba(255,255,255,0.6)" }} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {slide.title}
                </h2>

                {/* Reason */}
                <p className="text-base mb-8 max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {slide._reason || "No data was found in your project files to populate this slide."}
                </p>

                {/* Hint card */}
                <div
                    className="rounded-xl px-6 py-4 inline-flex items-center gap-3 max-w-md"
                    style={{
                        backgroundColor: "rgba(27,143,224,0.08)",
                        border: "1px solid rgba(27,143,224,0.2)",
                    }}
                >
                    <span className="text-xl shrink-0">💡</span>
                    <span className="text-sm font-medium text-left leading-snug" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {slide._hint || "Add relevant data to your project to unlock this slide."}
                    </span>
                </div>

                {/* Footer */}
                <div className="absolute bottom-5 flex items-center gap-2 text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <Keyboard className="w-3.5 h-3.5" />
                    Press
                    <kbd
                        className="px-1.5 py-0.5 rounded font-mono text-[10px]"
                        style={{
                            backgroundColor: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.6)",
                        }}
                    >E</kbd>
                    to add content or delete the slide
                </div>
            </motion.div>
        </motion.div>
    );
}
