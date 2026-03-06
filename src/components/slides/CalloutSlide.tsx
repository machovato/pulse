"use client";

import { motion } from "framer-motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";

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

export function CalloutSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? {}) as unknown as CalloutData;
    const kind = data.kind ?? "highlight";
    const isQuote = kind === "quote";

    const left = (
        <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-on-emphasis opacity-60">
                {LEFT_EYEBROW[kind]}
            </p>
            <h2
                className="font-bold text-text-on-emphasis leading-tight"
                style={{ fontSize: "clamp(24px, 3vw, 42px)" }}
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-3" />
        </div>
    );

    const right = (
        <div className={`flex flex-col justify-center h-full gap-5 ${RIGHT_ACCENT[kind]}`}>
            {isQuote && (
                <motion.div
                    className="text-[64px] leading-none font-serif select-none"
                    style={{ color: QUOTE_MARK_COLOR[kind] ?? "#007074", marginBottom: -16, lineHeight: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    "
                </motion.div>
            )}

            {isQuote ? (
                // Quote style — large italic text, no accent border
                <div className={isQuote ? "pl-0" : "pl-8"}>
                    <motion.p
                        className="font-bold text-text-primary italic leading-snug"
                        style={{ fontSize: "clamp(24px, 3.2vw, 44px)" }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                    >
                        {data.text}
                    </motion.p>
                </div>
            ) : (
                <motion.p
                    className="font-extrabold text-text-primary leading-tight pl-8"
                    style={{ fontSize: "clamp(28px, 3.6vw, 52px)", letterSpacing: "-0.02em" }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                >
                    {data.text}
                </motion.p>
            )}

            {data.attribution && (
                <motion.p
                    className="text-base text-text-secondary font-bold pl-8 mt-2 uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                >
                    — {data.attribution}
                </motion.p>
            )}
        </div>
    );

    return <LayoutSplit leftContent={left} rightContent={right} />;
}
