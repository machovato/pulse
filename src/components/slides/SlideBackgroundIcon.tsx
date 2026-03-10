"use client";

import { CheckCircle, AlertTriangle, BarChart3, Package, Clock, Trophy, Hand } from "lucide-react";

interface SlideBackgroundIconProps {
    title?: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    className?: string;
}

export function SlideBackgroundIcon({ title = "", position = "bottom-right", className }: SlideBackgroundIconProps) {
    const t = title.toLowerCase();
    
    let IconComponent = null;
    if (t.includes("what everyone agrees on")) IconComponent = CheckCircle;
    else if (t.includes("why this is urgent")) IconComponent = AlertTriangle;
    else if (t.includes("what we already know")) IconComponent = BarChart3;
    else if (t.includes("what you're getting")) IconComponent = Package;
    else if (t.includes("the timeline")) IconComponent = Clock;
    else if (t.includes("how we measure success")) IconComponent = Trophy;
    else if (t.includes("what i need") || t.includes("not in scope")) IconComponent = Hand;

    if (!IconComponent) return null;

    let positionClasses = "";
    if (position === "bottom-right") positionClasses = "bottom-8 right-12";
    if (position === "bottom-left") positionClasses = "bottom-8 left-12";
    if (position === "top-right") positionClasses = "top-8 right-12";
    if (position === "top-left") positionClasses = "top-8 left-12";

    return (
        <div className={`absolute ${positionClasses} pointer-events-none z-[0] ${className || 'opacity-15 text-accent-info'}`}>
            <IconComponent style={{ width: "300px", height: "300px" }} strokeWidth={1} />
        </div>
    );
}
