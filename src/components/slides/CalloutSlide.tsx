"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUpItem, scaleInItem } from "@/lib/motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";
import { Typography } from "../ui/Typography";
import { SlideEyebrow } from "./ui/SlideEyebrow";
import { CardBase } from "../ui/CardBase";

const MotionCard = motion.create(CardBase);

interface CalloutData {
    text: string;
    kind?: "decision" | "risk" | "quote" | "highlight";
    attribution?: string;
}

const LEFT_EYEBROW = {
    decision: "Decision",
    risk: "Risk",
    quote: "Quote",
    highlight: "Highlight",
};

// decision  = DTN Mid Blue #2255A4 — authoritative, binding
// risk       = DTN Red     #C8192B — danger signal, escalation needed
// highlight  = DTN Lime    #8DC63F — positive emphasis, good news
// quote      = DTN Teal    #007074 — neutral informational, voice
const RIGHT_ACCENT = {
    decision: "border-l-[12px] border-accent-info",
    risk: "border-l-[12px] border-accent-danger",
    quote: "",
    highlight: "border-l-[12px] border-accent-success",
};

const QUOTE_MARK_COLOR: Record<string, string> = {
    decision: "var(--accent-info)",
    risk: "var(--accent-danger)",
    highlight: "var(--accent-success)",
    quote: "var(--accent-info)",
};

export function CalloutSlide({ slide, deckMeta, disableAnimation = false }: { slide: LooseSlide, deckMeta?: Record<string, string>, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? {}) as unknown as CalloutData;
    const kind = data.kind ?? "highlight";
    const isQuote = kind === "quote";
    const isStrategy = template === "strategy";

    const left = (
        <motion.div
            className="flex flex-col gap-4"
            variants={slideUpItem(disableAnimation)}
            style={{
                "--text-primary": "#ffffff",
                "--text-secondary": "rgba(255, 255, 255, 0.9)",
                "--text-muted": "rgba(255, 255, 255, 0.6)"
            } as React.CSSProperties}
        >
            <SlideEyebrow slideData={slide.data} deckMeta={deckMeta} className="text-accent-info opacity-60" />
            <Typography as="h2" variant="subtitle" className="leading-tight mt-0 pt-0">
                {slide.title}
            </Typography>
            <div className="w-8 h-0.5 bg-white opacity-30 mt-3" />
        </motion.div>
    );

    const right = (
        <motion.div className={cn("flex flex-col justify-center h-full gap-5", isStrategy ? RIGHT_ACCENT[kind] : "")} variants={staggerContainer(disableAnimation)}>
            {isQuote && (
                <motion.div
                    className="text-[64px] leading-none font-serif select-none"
                    style={{ color: QUOTE_MARK_COLOR[kind] ?? "#007074", marginBottom: -16, lineHeight: 0.8 }}
                    variants={slideUpItem(disableAnimation)}
                >
                    "
                </motion.div>
            )}

            <div className={cn(isQuote ? "pl-0" : "pl-8")}>
                <Typography
                    as="p"
                    variant="h1"
                    className={cn(
                        "leading-snug",
                        isQuote ? "italic font-bold" : "font-extrabold"
                    )}
                >
                    {data.text}
                </Typography>
            </div>

            {data.attribution && (
                <Typography
                    variant="caption"
                    className="pl-8 mt-2"
                >
                    — {data.attribution}
                </Typography>
            )}
        </motion.div>
    );

    if (!isStrategy) {
        return (
            <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
                <LayoutWhite center={true}>
                    <MotionCard
                        accent="none"
                        className="max-w-4xl w-full mx-auto shadow-lg relative overflow-hidden"
                        style={{ padding: "48px" }}
                        variants={scaleInItem(disableAnimation)}
                    >
                        <div className={cn("absolute top-0 left-0 bottom-0 w-2",
                            kind === "decision" ? "bg-accent-info" :
                                kind === "risk" ? "bg-accent-danger" :
                                    kind === "highlight" ? "bg-accent-success" : "bg-text-muted"
                        )} />
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
                                <Typography variant="badge" className="text-text-secondary opacity-60">
                                    {LEFT_EYEBROW[kind]}
                                </Typography>
                                <Typography variant="caption" className="font-semibold text-text-primary">
                                    {slide.title}
                                </Typography>
                            </div>
                            {right}
                        </div>
                    </MotionCard>
                </LayoutWhite>
            </motion.div>
        );
    }

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutSplit leftContent={left} rightContent={right} />
        </motion.div>
    );
}
