"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import type { LooseSlide, LooseDeck } from "@/lib/schema";
import { SlideSchema } from "@/lib/schema";
import { updateExistingDeck } from "@/app/actions";
import { HeroForm } from "./forms/HeroForm";
import { TextAreaField, TextField } from "./FormFields";

import { ContextForm } from "./forms/ContextForm";
import { ProblemForm } from "./forms/ProblemForm";
import { EvidenceForm } from "./forms/EvidenceForm";
import { FrameworkForm } from "./forms/FrameworkForm";
import { RoadmapForm } from "./forms/RoadmapForm";
import { BlockersForm } from "./forms/BlockersForm";
import { KpisForm } from "./forms/KpisForm";
import { PipelineForm } from "./forms/PipelineForm";
import { GridForm } from "./forms/GridForm";
import { CalloutForm } from "./forms/CalloutForm";
import { AgendaForm } from "./forms/AgendaForm";
import { DecisionLogForm } from "./forms/DecisionLogForm";

interface SlideFormEditorProps {
    deck: LooseDeck;
    deckId: string;
    slideIndex: number;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export type BaseSlideFormProps<T = any> = {
    slide: T;
    onChange: (slide: T) => void;
    errors: Record<string, string>;
};

export function SlideFormEditor({
    deck,
    deckId,
    slideIndex,
    onClose,
    onSaveSuccess,
}: SlideFormEditorProps) {
    const originalSlide = deck.slides[slideIndex];
    const [localSlide, setLocalSlide] = useState<LooseSlide>({ ...originalSlide });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this slide? This action cannot be undone.")) {
            return;
        }

        setSaveError(null);
        setIsDeleting(true);

        try {
            // Filter out the current slide
            const updatedDeck: LooseDeck = {
                ...deck,
                slides: deck.slides.filter((_, idx) => idx !== slideIndex),
            };

            const res = await updateExistingDeck(deckId, updatedDeck);
            if (res.success) {
                onSaveSuccess();
            } else {
                setSaveError(res.error || "Failed to delete slide.");
            }
        } catch (e) {
            setSaveError(e instanceof Error ? e.message : "Failed to delete slide.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        setSaveError(null);
        setErrors({});

        // 1. Determine if the slide has meaningful content in its data
        const slideToSave = { ...localSlide };
        const data = slideToSave.data || {};
        const hasContent = Object.values(data).some((val) => {
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === "string") return val.trim().length > 0;
            if (typeof val === "object" && val !== null) return Object.keys(val).length > 0;
            return val !== undefined && val !== null;
        });

        // 2. Toggle _missing based on content — but keep _reason/_hint as breadcrumbs
        if (!hasContent && (slideToSave._reason || originalSlide._reason)) {
            // Empty content + breadcrumbs exist → revert to placeholder
            slideToSave._missing = true;
            slideToSave._reason = slideToSave._reason || originalSlide._reason;
            slideToSave._hint = slideToSave._hint || originalSlide._hint;
        } else if (hasContent) {
            // Has real content → deactivate missing flag but keep breadcrumbs
            delete slideToSave._missing;
        }

        // 3. Validate local slide against schema for its type
        const result = SlideSchema.safeParse(slideToSave);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                const path = err.path.join(".");
                if (!newErrors[path]) newErrors[path] = err.message;
            });
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            // 4. Build the updated deck
            const updatedDeck: LooseDeck = {
                ...deck,
                slides: [...deck.slides],
            };
            updatedDeck.slides[slideIndex] = slideToSave;

            // 3. Save to server
            const res = await updateExistingDeck(deckId, updatedDeck);
            if (res.success) {
                onSaveSuccess();
            } else {
                setSaveError(res.error || "Failed to save changes.");
            }
        } catch (e) {
            setSaveError(e instanceof Error ? e.message : "Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <motion.div
            className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white shadow-2xl border-l border-gray-200 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-500 rounded">
                        {localSlide.type}
                    </span>
                    <h2 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                        {localSlide.title || "Untitled Slide"}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg"
                    aria-label="Close editor"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Form Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {saveError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 font-medium text-xs rounded-lg">
                        {saveError}
                    </div>
                )}

                {localSlide.type === "hero" ? (
                    <HeroForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "context" ? (
                    <ContextForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "problem" ? (
                    <ProblemForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "evidence" ? (
                    <EvidenceForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "framework" ? (
                    <FrameworkForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "roadmap" || localSlide.type === "timeline" ? (
                    <RoadmapForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "blockers" ? (
                    <BlockersForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "kpis" ? (
                    <KpisForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "pipeline" ? (
                    <PipelineForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "grid" ? (
                    <GridForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "callout" ? (
                    <CalloutForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "agenda" ? (
                    <AgendaForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : localSlide.type === "decision_log" ? (
                    <DecisionLogForm slide={localSlide} onChange={setLocalSlide} errors={errors} />
                ) : (
                    <p className="text-sm text-gray-500 italic">Editor for {localSlide.type} not implemented yet.</p>
                )}

                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Speaker Notes</h3>
                    <TextAreaField
                        label="Notes visible during presentation"
                        value={localSlide.notes || ""}
                        onChange={(val) => setLocalSlide({ ...localSlide, notes: val })}
                        placeholder="Add private speaker notes here..."
                        rows={4}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-3">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting || isSaving}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete This Slide"}
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting || isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isDeleting}
                        className="px-4 py-2 text-sm font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-bg)] rounded-lg shadow-sm transition-all flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
