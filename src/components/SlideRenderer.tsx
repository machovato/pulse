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
}

/**
 * Pure switch rendering function. Always returns something — never throws.
 * The density mode has already been applied to slide.data by processSlides().
 */
export function SlideRenderer({ slide, density, deckMeta, schemaVersion = 1 }: SlideRendererProps) {
    // V1 backward compatibility for strategy slides mapped to grid
    if (schemaVersion === 1) {
        switch (slide.type) {
            case "context":
            case "problem":
            case "evidence":
            case "framework":
                return <GridSlide slide={slide} />;
        }
    }

    // Default V2 / Generic mapping
    switch (slide.type) {
        case "hero": return <HeroSlide slide={slide} deckMeta={deckMeta} />;
        case "kpis": return <KpisSlide slide={slide} />;
        case "pipeline": return <PipelineSlide slide={slide} />;
        case "grid": return <GridSlide slide={slide} />;
        case "context": return <ContextSlide slide={slide} />;
        case "problem": return <ProblemSlide slide={slide} />;
        case "evidence": return <EvidenceSlide slide={slide} />;
        case "framework": return <FrameworkSlide slide={slide} />;
        case "timeline":
        case "roadmap":
            return <TimelineSlide slide={slide} />;
        case "blockers": return <BlockersSlide slide={slide} deckMeta={deckMeta} />;
        case "callout": return <CalloutSlide slide={slide} />;
        case "agenda": return <AgendaSlide slide={slide} />;
        case "decision_log": return <DecisionLogSlide slide={slide} />;
        default: return <UnknownSlide slide={slide} />;
    }
}
