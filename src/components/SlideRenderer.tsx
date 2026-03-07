"use client";

import type { LooseSlide } from "@/lib/schema";
import type { DensityMode } from "@/lib/paginate";
import { HeroSlide } from "./slides/HeroSlide";
import { KpisSlide } from "./slides/KpisSlide";
import { PipelineSlide } from "./slides/PipelineSlide";
import { GridSlide } from "./slides/GridSlide";
import { TimelineSlide } from "./slides/TimelineSlide";
import { BlockersSlide } from "./slides/BlockersSlide";
import { CalloutSlide } from "./slides/CalloutSlide";
import { AgendaSlide } from "./slides/AgendaSlide";
import { DecisionLogSlide } from "./slides/DecisionLogSlide";
import { UnknownSlide } from "./slides/UnknownSlide";
import { ContextSlide } from "./slides/ContextSlide";
import { ProblemSlide } from "./slides/ProblemSlide";
import { EvidenceSlide } from "./slides/EvidenceSlide";
import { FrameworkSlide } from "./slides/FrameworkSlide";

interface SlideRendererProps {
    slide: LooseSlide;
    density: DensityMode;
    deckMeta?: Record<string, string>;
    schemaVersion?: number;
    disableAnimation?: boolean;
}

/**
 * Pure switch rendering function. Always returns something — never throws.
 * The density mode has already been applied to slide.data by processSlides().
 */
export function SlideRenderer({ slide, density, deckMeta, schemaVersion = 1, disableAnimation = false }: SlideRendererProps) {
    // V1 backward compatibility for strategy slides mapped to grid
    if (schemaVersion === 1) {
        switch (slide.type) {
            case "context":
            case "problem":
            case "evidence":
            case "framework":
                return <GridSlide slide={slide} disableAnimation={disableAnimation} />;
        }
    }

    // Default V2 / Generic mapping
    switch (slide.type) {
        case "hero": return <HeroSlide slide={slide} disableAnimation={disableAnimation} />;
        case "kpis": return <KpisSlide slide={slide} disableAnimation={disableAnimation} />;
        case "pipeline": return <PipelineSlide slide={slide} disableAnimation={disableAnimation} />;
        case "grid": return <GridSlide slide={slide} disableAnimation={disableAnimation} />;
        case "context": return <ContextSlide slide={slide} disableAnimation={disableAnimation} />;
        case "problem": return <ProblemSlide slide={slide} disableAnimation={disableAnimation} />;
        case "evidence": return <EvidenceSlide slide={slide} disableAnimation={disableAnimation} />;
        case "framework": return <FrameworkSlide slide={slide} disableAnimation={disableAnimation} />;
        case "timeline":
        case "roadmap":
            return <TimelineSlide slide={slide} disableAnimation={disableAnimation} />;
        case "blockers": return <BlockersSlide slide={slide} deckMeta={deckMeta} disableAnimation={disableAnimation} />;
        case "callout": return <CalloutSlide slide={slide} disableAnimation={disableAnimation} />;
        case "agenda": return <AgendaSlide slide={slide} disableAnimation={disableAnimation} />;
        case "decision_log": return <DecisionLogSlide slide={slide} disableAnimation={disableAnimation} />;
        default: return <UnknownSlide slide={slide} />;
    }
}
