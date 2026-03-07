import { Variants } from "framer-motion";

/**
 * Standard staggered container.
 * Applied to the parent element housing the list/grid of animated elements.
 * 
 * If `disableAnimation` is true, immediately jumps to the visible state
 * without any stagger or delay.
 */
export const staggerContainer = (disableAnimation: boolean = false): Variants => ({
    hidden: disableAnimation ? { opacity: 1 } : { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: disableAnimation ? 0 : 0.1,
            delayChildren: disableAnimation ? 0 : 0.05,
        },
    },
});

/**
 * Standard upward-fade element.
 * Use for almost all slide choreography (cards, texts, rows).
 * Lifts slightly from the bottom (20px) while fading in.
 */
export const slideUpItem = (disableAnimation: boolean = false): Variants => ({
    hidden: disableAnimation
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: disableAnimation ? 0 : 0.5,
            ease: disableAnimation ? "linear" : "easeOut",
        },
    },
});

/**
 * Subtle scale-in effect.
 * Reserved for Callout slides or single-focus focal points.
 * Expands slightly (0.97 -> 1) simulating a firm "landing".
 */
export const scaleInItem = (disableAnimation: boolean = false): Variants => ({
    hidden: disableAnimation
        ? { opacity: 1, scale: 1 }
        : { opacity: 0, scale: 0.97 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: disableAnimation ? 0 : 0.6,
            ease: disableAnimation ? "linear" : "easeOut",
        },
    },
});

/**
 * Stagger timeline sequence container.
 * Specific to Timeline/Roadmap spines, ensuring the spine draws first, then
 * milestones appear.
 */
export const timelineContainer = (disableAnimation: boolean = false): Variants => ({
    hidden: disableAnimation ? { opacity: 1 } : { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: disableAnimation ? 0 : 0.1,
            delayChildren: disableAnimation ? 0 : 0.25, // Let the main timeline draw start
        },
    },
});
