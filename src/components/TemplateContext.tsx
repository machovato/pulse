"use client";

import React, { createContext, useContext, ReactNode } from "react";

type TemplateType = "status" | "strategy" | string;

interface TemplateContextType {
    template: TemplateType;
}

const TemplateContext = createContext<TemplateContextType>({ template: "status" });

export function TemplateProvider({
    template,
    theme,
    children
}: {
    template: TemplateType;
    theme?: string;
    children: ReactNode;
}) {
    const activeTheme = theme && theme !== "default" ? theme : "blue";

    return (
        <TemplateContext.Provider value={{ template }}>
            <div data-template={template} data-theme={activeTheme} className="h-full w-full">
                {children}
            </div>
        </TemplateContext.Provider>
    );
}

export function useTemplate() {
    return useContext(TemplateContext);
}
