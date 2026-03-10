"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SlideRenderer } from "@/components/SlideRenderer";
import { SlideFormEditor } from "@/components/editor/SlideFormEditor";
import type { LooseDeck, LooseSlide } from "@/lib/schema";
import { processSlides, type DensityMode } from "@/lib/paginate";
import { TemplateProvider } from "@/components/TemplateContext";

// ─── Slide Grid Overlay ───────────────────────────────────────────────────────

// Layout 1 applies to hero slides. Used to decide dot and overlay accent colors.
const HERO_LAYOUTS = new Set(["hero"]);

function SlideGridOverlay({
    slides,
    currentIndex,
    density,
    deckMeta,
    schemaVersion,
    onSelect,
    onClose,
}: {
    slides: LooseSlide[];
    currentIndex: number;
    density: DensityMode;
    deckMeta: Record<string, string>;
    schemaVersion: number;
    onSelect: (i: number) => void;
    onClose: () => void;
}) {
    // Scale factor: thumbnails are 240x135, design space is 1200x675 → scale = 0.2
    const THUMB_W = 240;
    const THUMB_H = 135;
    const DESIGN_W = 1200;
    const DESIGN_H = 675;
    const SCALE = THUMB_W / DESIGN_W;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "rgba(13,34,64,0.96)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            tabIndex={-1}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <div>
                    <p className="text-white font-semibold text-sm">Slide Overview</p>
                    <p className="text-white/40 text-xs mt-0.5">
                        {slides.length} slide{slides.length !== 1 ? "s" : ""} · Click to jump
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/50 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                    <span className="bg-white/10 rounded px-2 py-1 font-mono">Esc</span>
                    Close
                </button>
            </div>

            {/* Thumbnail grid */}
            <div className="flex-1 overflow-auto px-8 py-6">
                <div className="flex flex-wrap gap-5">
                    {slides.map((slide, i) => {
                        const isCurrent = i === currentIndex;
                        return (
                            <motion.button
                                key={slide.id ?? i}
                                onClick={() => onSelect(i)}
                                className="group relative flex flex-col gap-2 items-start cursor-pointer"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.025 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                {/* Thumbnail frame */}
                                <div
                                    className={`relative overflow-hidden rounded-lg transition-all ${isCurrent
                                        ? "ring-2 ring-[#1B8FE0] ring-offset-2 ring-offset-[#0D2240]"
                                        : "ring-1 ring-white/10 hover:ring-white/30"
                                        }`}
                                    style={{ width: THUMB_W, height: THUMB_H }}
                                >
                                    <div
                                        className="absolute top-0 left-0 pointer-events-none"
                                        data-template={deckMeta.template || "status"}
                                        style={{
                                            width: DESIGN_W,
                                            height: DESIGN_H,
                                            transform: `scale(${SCALE})`,
                                            transformOrigin: "top left",
                                        }}
                                    >
                                        <SlideRenderer slide={slide} density={density} deckMeta={deckMeta} schemaVersion={schemaVersion} disableAnimation={true} />
                                    </div>

                                    {/* Current slide highlight overlay */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 border-2 border-[#1B8FE0] rounded-lg pointer-events-none" />
                                    )}
                                </div>

                                {/* Slide number + title below */}
                                <div className="flex items-center gap-1.5 max-w-[240px]">
                                    <span className="text-[10px] font-bold text-white/30 tabular-nums w-5 shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors truncate">
                                        {slide.title}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Speaker Notes Overlay ─────────────────────────────────────────────────────

function SpeakerNotesOverlay({
    notes,
    onClose,
    onEditSlide,
}: {
    notes?: string;
    onClose: () => void;
    onEditSlide: () => void;
}) {
    return (
        <motion.div
            className="fixed inset-x-0 bottom-0 z-40 h-[35vh] bg-gray-900/95 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="max-w-6xl mx-auto w-full h-full flex flex-col p-8">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B8FE0]">
                        Speaker Notes
                    </p>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg"
                        aria-label="Close notes"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                        {notes || (
                            <span className="text-white/40 italic">No speaker notes for this slide.</span>
                        )}
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 shrink-0 flex justify-end">
                    <button
                        onClick={onEditSlide}
                        className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors border border-white/5"
                    >
                        <span className="opacity-70">✏️</span> Edit This Slide
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Dot Progress Indicator ───────────────────────────────────────────────────

function DotProgress({
    total,
    current,
    isHero,
}: {
    total: number;
    current: number;
    isHero: boolean;
}) {
    const dotBase = isHero ? "bg-white/30" : "bg-[#003057]/20";
    const dotActive = isHero ? "bg-white" : "bg-[var(--dtn-blue)]";

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i === current
                        ? `w-4 h-1.5 ${dotActive}`
                        : `w-1.5 h-1.5 ${dotBase}`
                        }`}
                />
            ))}
        </div>
    );
}

// ─── Main Presentation Client ─────────────────────────────────────────────────

interface PresentationClientProps {
    deck: LooseDeck;
    deckId: string;
}

const slideVariants = {
    enter: (dir: number) => ({
        x: dir === 0 ? 0 : dir > 0 ? "100%" : "-100%",
        opacity: dir === 0 ? 1 : 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
        x: dir > 0 ? "-100%" : "100%",
        opacity: 0,
    }),
};

export function PresentationClient({ deck, deckId }: PresentationClientProps) {
    const router = useRouter();
    const [density, setDensity] = useState<DensityMode>("full");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showNotes, setShowNotes] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [showFormEditor, setShowFormEditor] = useState(false);

    // Track viewed slides to only animate them once
    const [viewedSlides, setViewedSlides] = useState<Set<number>>(new Set());

    useEffect(() => {
        setViewedSlides(prev => {
            if (prev.has(currentIndex)) return prev;
            const next = new Set(prev);
            next.add(currentIndex);
            return next;
        });
    }, [currentIndex]);

    const slides = processSlides(deck.slides, density);
    const total = slides.length;

    // Map the rendered slide index back to the index in deck.slides
    const indexMap: number[] = [];
    deck.slides.forEach((slide, idx) => {
        const paginated = processSlides([slide], density);
        paginated.forEach(() => indexMap.push(idx));
    });
    const originalIndex = indexMap[Math.min(currentIndex, total - 1)] ?? 0;

    const navigate = useCallback(
        (delta: number) => {
            setDirection(delta);
            setCurrentIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
        },
        [total]
    );

    const goTo = useCallback(
        (i: number) => {
            const clamped = Math.max(0, Math.min(total - 1, i));
            setDirection(clamped > currentIndex ? 1 : -1);
            setCurrentIndex(clamped);
        },
        [total, currentIndex]
    );

    // Keyboard handler
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            // Dismiss overlays first
            if (e.key === "Escape") {
                if (showFormEditor) { setShowFormEditor(false); return; }
                if (showGrid) { setShowGrid(false); return; }
                if (showNotes) { setShowNotes(false); return; }
                return;
            }
            // Don't navigate when overlays are open
            if (showGrid || showNotes || showFormEditor) return;

            switch (e.key) {
                case "ArrowRight":
                case "ArrowDown":
                    navigate(1);
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    navigate(-1);
                    break;
                case "n":
                case "N":
                    if (e.shiftKey) {
                        setShowFormEditor((v) => !v);
                    } else {
                        setShowNotes((v) => !v);
                    }
                    break;
                case "e":
                case "E":
                    if (e.shiftKey) {
                        router.push(`/editor?editId=${deckId}`);
                    } else {
                        router.push("/");
                    }
                    break;
                case "g":
                case "G":
                    setShowGrid((v) => !v);
                    break;
                case "d":
                case "D":
                    setDensity((d) => (d === "full" ? "executive" : "full"));
                    break;
                case "p":
                case "P":
                    window.print();
                    break;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [navigate, router, deckId, showNotes, showGrid, showFormEditor]);

    const currentSlide = slides[Math.min(currentIndex, total - 1)];
    const isHero = currentSlide ? HERO_LAYOUTS.has(currentSlide.type) : false;

    if (!currentSlide) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <p className="text-gray-400">No slides to display.</p>
            </div>
        );
    }

    return (
        <TemplateProvider template={deck.meta.template || "status"}>
            {/* Full-viewport slide stage */}
            <div className="fixed inset-0 overflow-hidden bg-white">
                <AnimatePresence custom={direction} mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        className="absolute inset-0"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
                    >
                        <SlideRenderer
                            slide={currentSlide}
                            density={density}
                            deckMeta={deck.meta}
                            schemaVersion={deck.schemaVersion || 1}
                            disableAnimation={viewedSlides.has(currentIndex)}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Click zones — invisible, no hover state */}
                <div
                    className="absolute top-0 left-0 h-full w-[15%] z-20 cursor-pointer"
                    onClick={() => navigate(-1)}
                    aria-label="Previous slide"
                />
                <div
                    className="absolute top-0 right-0 h-full w-[15%] z-20 cursor-pointer"
                    onClick={() => navigate(1)}
                    aria-label="Next slide"
                />

                {/* Density mode badge — subtle, upper-left, only when executive */}
                {density === "executive" && (
                    <div
                        className={`fixed top-4 left-4 z-30 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${isHero
                            ? "bg-white/15 text-white/70"
                            : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        Executive Mode
                    </div>
                )}

                {/* Dot progress */}
                <DotProgress total={total} current={currentIndex} isHero={isHero} />
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {showNotes && (
                    <SpeakerNotesOverlay
                        key="notes"
                        notes={currentSlide.notes}
                        onClose={() => setShowNotes(false)}
                        onEditSlide={() => {
                            setShowNotes(false);
                            setShowFormEditor(true);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFormEditor && (
                    <SlideFormEditor
                        key="editor"
                        deck={deck}
                        deckId={deckId}
                        slideIndex={originalIndex}
                        onClose={() => setShowFormEditor(false)}
                        onSaveSuccess={() => {
                            setShowFormEditor(false);
                            router.refresh();
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGrid && (
                    <SlideGridOverlay
                        key="grid"
                        slides={slides}
                        currentIndex={currentIndex}
                        density={density}
                        deckMeta={deck.meta}
                        schemaVersion={deck.schemaVersion || 1}
                        onSelect={(i) => { goTo(i); setShowGrid(false); }}
                        onClose={() => setShowGrid(false)}
                    />
                )}
            </AnimatePresence>

        </TemplateProvider>
    );
}
