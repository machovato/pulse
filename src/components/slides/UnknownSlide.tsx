"use client";

import { AlertCircle } from "lucide-react";
import type { LooseSlide } from "@/lib/schema";

export function UnknownSlide({ slide }: { slide: LooseSlide }) {
    return (
        <div className="flex flex-col h-full px-12 py-10 items-center justify-center">
            <div className="card p-10 max-w-md text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-10 h-10 text-[var(--text-secondary)]" />
                <div>
                    <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                        Unsupported slide type
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{slide.type}</code>
                        {" "}is not a recognized slide type. Add it to the renderer or check your JSON.
                    </p>
                    {slide.title && (
                        <p className="text-xs text-[var(--text-secondary)] mt-2 opacity-60">Slide title: {slide.title}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
