"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CircleDot } from "lucide-react";
import { staggerContainer, slideUpItem } from "@/lib/motion";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";

interface FrameworkLane {
    title: string;
    body: string;
    icon?: string;
    type: "control" | "influence" | "concern";
    rank: number;
}

interface FrameworkData {
    lanes: FrameworkLane[];
}

function getLucideIcon(name?: string, className?: string) {
    if (!name) return <CircleDot className={className || "w-5 h-5"} />;
    const key = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    // @ts-expect-error - Dynamic lookup
    const IconComponent = LucideIcons[key] || LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)];
    if (!IconComponent) return <CircleDot className={className || "w-5 h-5"} />;
    return <IconComponent className={className || "w-5 h-5"} />;
}

export function FrameworkSlide({ slide, disableAnimation = false }: { slide: LooseSlide, disableAnimation?: boolean }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { lanes: [] }) as unknown as FrameworkData;
    const lanes = data.lanes ?? [];
    const isStrategy = template === "strategy";

    // Sort lanes by rank ascending so Control is 1, Influence 2, Concern 3
    const sortedLanes = [...lanes].sort((a, b) => a.rank - b.rank);

    return (
        <motion.div className="w-full h-full" variants={staggerContainer(disableAnimation)} initial="hidden" animate="visible">
            <LayoutWhite center={false}>
                <div className="w-full flex-1 flex flex-col justify-center py-12">
                    <motion.div className="mb-12 shrink-0" variants={slideUpItem(disableAnimation)}>
                        <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60 mb-2">
                            Framework
                        </p>
                        <h2
                            className="font-bold text-text-primary leading-tight"
                            style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
                        >
                            {slide.title}
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-5 flex-1 w-full max-w-6xl mx-auto justify-center">
                        {sortedLanes.map((lane, i) => {
                            let fillProps = "";
                            let borderProps = "";
                            let widthProps = "w-full";
                            let opacityProps = 1;

                            if (lane.type === "control") {
                                fillProps = "bg-surface-primary text-text-on-emphasis";
                                borderProps = "border-[4px] border-surface-primary shadow-xl";
                                widthProps = "w-full";
                                opacityProps = 1;
                            } else if (lane.type === "influence") {
                                fillProps = "bg-surface-secondary text-text-primary";
                                borderProps = cn("border-[4px] shadow-lg", isStrategy ? "border-dashed border-accent-info" : "border-solid border-border-default");
                                widthProps = "w-[92%] mx-auto";
                                opacityProps = 1;
                            } else if (lane.type === "concern") {
                                fillProps = "bg-surface-page text-text-secondary";
                                borderProps = cn("border-[4px] shadow-md", isStrategy ? "border-dotted border-border-muted" : "border-solid border-border-muted");
                                widthProps = "w-[84%] mx-auto";
                                opacityProps = 1;
                            }

                            // Animate down one by one
                            const delay = 0.1 + i * 0.15;

                            return (
                                <motion.div
                                    key={i}
                                    className={`flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:px-10 md:py-8 rounded-2xl ${fillProps} ${borderProps} ${widthProps} shadow-sm`}
                                    style={{ opacity: opacityProps }}
                                    variants={slideUpItem(disableAnimation)}
                                >
                                    <div className="shrink-0 flex flex-col items-center md:items-start md:w-48">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={lane.type === 'control' ? 'text-text-on-emphasis' : 'text-accent-info'}>
                                                {getLucideIcon(lane.icon, "w-10 h-10")}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1.5 text-sm font-bold uppercase tracking-[0.15em] rounded-md inline-block shadow-sm ${lane.type === 'control' ? 'bg-surface-page text-text-primary' : 'bg-surface-muted text-text-primary border border-border-default/80'}`}>
                                            {lane.type}
                                        </div>
                                    </div>
                                    <div className="flex-1 border-l-[6px] pl-6 md:pl-10 border-border-default/50 rounded-l-[4px]">
                                        <h3 className={`text-2xl md:text-[32px] font-bold mb-3 ${lane.type === 'control' ? 'text-text-on-emphasis' : 'text-text-primary'}`}>
                                            {lane.title}
                                        </h3>
                                        <p className={`text-lg md:text-xl font-medium leading-relaxed ${lane.type === 'control' ? 'text-text-on-emphasis opacity-90' : 'text-text-secondary'}`}>
                                            {lane.body}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </LayoutWhite>
        </motion.div>
    );
}
