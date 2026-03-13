"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ChevronDown,
    Loader2,
    Upload,
    Wrench,
    SortAsc,
    Copy,
    Check,
} from "lucide-react";
import { LooseDeckSchema, DeckSchema } from "@/lib/schema";
import { getTemplateWarnings, suggestOrder } from "@/lib/templates";
import { structuralRepair, contentRepair } from "@/lib/repair";
import { publishDeck, updateExistingDeck } from "@/app/actions";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then(m => m.default), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400 text-sm">
            Loading editor…
        </div>
    ),
});

const DEFAULT_JSON = JSON.stringify(
    {
        schemaVersion: 2,
        meta: {
            title: "My Presentation",
            subtitle: "Subtitle goes here",
            date: new Date().toISOString().slice(0, 10),
            audience: "team",
            template: "status",
            rag: "green",
            headline: "One-sentence summary of the current state",
        },
        slides: [
            {
                type: "hero",
                title: "My Presentation",
                data: {
                    subtitle: "Q1 2026 Sprint Review",
                    rag: "green",
                    kpis: [
                        { label: "Velocity", value: "42 pts", icon: "Zap", trend: "up" },
                        { label: "Open Tickets", value: "7", icon: "Bug", trend: "down" },
                    ],
                },
            },
            {
                type: "kpis",
                title: "Key Metrics",
                data: {
                    items: [
                        { label: "Uptime", value: "99.97%", icon: "Activity", trend: "up", note: "30-day rolling" },
                        { label: "API Latency", value: "84ms", icon: "Zap", trend: "flat" },
                    ],
                },
            },
            {
                type: "blockers",
                title: "Blockers",
                data: { items: [] },
            },
        ],
    },
    null,
    2
);

type ValidationState = "idle" | "valid" | "invalid";

interface ZodError {
    path: string;
    message: string;
}

export function EditorClient({ existingJson, editId }: { existingJson?: string; editId?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefill = searchParams.get("prefill");
    const initialJson = (() => {
        if (existingJson) return existingJson;
        if (prefill) { try { JSON.parse(prefill); return prefill; } catch { /* fall through */ } }
        return DEFAULT_JSON;
    })();
    const [json, setJson] = useState(initialJson);
    const [validationState, setValidationState] = useState<ValidationState>("idle");
    const [zodErrors, setZodErrors] = useState<ZodError[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [repairChanges, setRepairChanges] = useState<string[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [repairOpen, setRepairOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const [availableThemes, setAvailableThemes] = useState<string[]>([]);

    // Fetch themes on mount
    useEffect(() => {
        fetch("/api/themes")
            .then(res => res.json())
            .then(data => {
                if (data.themes) setAvailableThemes(data.themes);
            })
            .catch(console.error);
    }, []);

    const validate = useCallback((value: string) => {
        setRepairChanges([]);
        setPublishError(null);
        try {
            const parsed = JSON.parse(value);
            const result = DeckSchema.safeParse(parsed);
            if (result.success) {
                const warns = getTemplateWarnings(result.data.slides, result.data.meta.template);
                setWarnings(warns);
                setZodErrors([]);
                setValidationState("valid");
            } else {
                setZodErrors(
                    result.error.errors.map((e) => ({
                        path: e.path.join(".") || "root",
                        message: e.message,
                    }))
                );
                setWarnings([]);
                setValidationState("invalid");
            }
        } catch {
            setZodErrors([{ path: "JSON", message: "Invalid JSON syntax" }]);
            setWarnings([]);
            setValidationState("invalid");
        }
    }, []);

    const handleChange = useCallback(
        (value: string | undefined) => {
            const v = value ?? "";
            setJson(v);
            validate(v);
        },
        [validate]
    );

    const handleRepair = (mode: "structural" | "content") => {
        setRepairOpen(false);
        try {
            const raw = JSON.parse(json);
            const { fixed, changes } = mode === "structural" ? structuralRepair(raw) : contentRepair(raw);
            const newJson = JSON.stringify(fixed, null, 2);
            setJson(newJson);
            setRepairChanges(changes);
            validate(newJson);
        } catch {
            try {
                // Attempt to fix raw JSON parse errors first
                const { fixed, changes } = structuralRepair({});
                const newJson = JSON.stringify(fixed, null, 2);
                setJson(newJson);
                setRepairChanges(changes);
                validate(newJson);
            } catch {
                setZodErrors([{ path: "JSON", message: "Cannot parse — too malformed to repair" }]);
            }
        }
    };

    const handleSuggestOrder = () => {
        try {
            const raw = JSON.parse(json);
            const looseParsed = LooseDeckSchema.safeParse(raw);
            if (looseParsed.success) {
                const reordered = suggestOrder(looseParsed.data.slides, looseParsed.data.meta.template);
                const newDeck = { ...looseParsed.data, slides: reordered };
                const newJson = JSON.stringify(newDeck, null, 2);
                setJson(newJson);
                validate(newJson);
            }
        } catch { }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        setPublishError(null);
        try {
            const raw = JSON.parse(json);
            
            // If we have an editId, overwrite the existing deck instead of creating a new version
            const result = editId 
                ? await updateExistingDeck(editId, raw)
                : await publishDeck(raw);

            if (result.success && result.id) {
                // Remove visual bounce, just silently succeed or briefly show success
                router.push(`/deck/${result.id}`);
            } else {
                setPublishError(result.error ?? "Unknown error");
            }
        } catch {
            setPublishError("JSON parse error — please validate before publishing");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleThemeChange = (themeName: string | null) => {
        setThemeOpen(false);
        try {
            const raw = JSON.parse(json);
            if (!raw.meta) raw.meta = {};
            
            if (themeName) {
                raw.meta.theme = themeName;
            } else {
                delete raw.meta.theme;
            }
            
            const newJson = JSON.stringify(raw, null, 2);
            setJson(newJson);
            validate(newJson);
        } catch {
            // If json is invalid, ignore theme change
            setZodErrors([{ path: "JSON", message: "Cannot change theme with invalid JSON" }]);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isValid = validationState === "valid";

    // Only extract theme to show in the UI, do not apply to document
    const activeTheme = (() => {
        try {
            return JSON.parse(json)?.meta?.theme;
        } catch {
            return null;
        }
    })();

    return (
        <div className="flex flex-col" style={{ height: "calc(100vh - 96px)", backgroundColor: "var(--surface-primary)" }}>
            {/* Toolbar */}
            <div className="bg-white border-b border-[var(--card-border)] px-6 py-3 flex items-center justify-between gap-4 no-print">
                <div className="flex items-center gap-2">
                    {/* Validation Status */}
                    <ValidationPill state={validationState} errorCount={zodErrors.length} />

                    {/* Warn count */}
                    {warnings.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                            <AlertTriangle className="w-3 h-3" />
                            {warnings.length} template warning{warnings.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Copy */}
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] bg-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                    </button>

                    {/* Theme dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setThemeOpen((o) => !o)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] bg-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Theme: <span className="font-semibold text-[var(--text-primary)]">{activeTheme || "Default"}</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                            {themeOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1 z-50 bg-white border border-[var(--card-border)] rounded-xl shadow-lg overflow-hidden min-w-[160px]"
                                >
                                    <button
                                        onClick={() => handleThemeChange(null)}
                                        className={cn(
                                            "w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm",
                                            !activeTheme ? "font-bold text-[var(--accent-primary)] bg-[var(--accent-primary-bg)]/20" : "text-[var(--text-primary)]"
                                        )}
                                    >
                                        Default Neutral
                                    </button>
                                    {availableThemes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => handleThemeChange(t)}
                                            className={cn(
                                                "w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm capitalize",
                                                activeTheme === t ? "font-bold text-[var(--accent-primary)] bg-[var(--accent-primary-bg)]/20" : "text-[var(--text-primary)]"
                                            )}
                                        >
                                            {t} Theme
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Suggest Order */}
                    <button
                        onClick={handleSuggestOrder}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] bg-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <SortAsc className="w-3 h-3" />
                        Suggested Order
                    </button>

                    {/* Repair dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setRepairOpen((o) => !o);
                                setThemeOpen(false);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] bg-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Wrench className="w-3 h-3" />
                            Repair Format
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                            {repairOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-1 z-50 bg-white border border-[var(--card-border)] rounded-xl shadow-lg overflow-hidden min-w-[240px]"
                                >
                                    <button
                                        onClick={() => handleRepair("structural")}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-[var(--border-default)]"
                                    >
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">Structural Repair</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Fix schema shape only · preserves all text</p>
                                    </button>
                                    <button
                                        onClick={() => handleRepair("content")}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">Content Repair</p>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Also normalizes text · may rewrite values</p>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Publish */}
                    <button
                        onClick={handlePublish}
                        disabled={!isValid || isPublishing}
                        className={cn(
                            "inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-lg transition-all",
                            isValid && !isPublishing
                                ? "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-bg)] shadow-sm hover:shadow-md"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {isPublishing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {isPublishing ? (editId ? "Saving…" : "Publishing…") : (editId ? "Save Changes" : "Publish")}
                    </button>
                </div>
            </div>

            {/* Editor + feedback panel */}
            <div className="flex flex-1 min-h-0">
                {/* Monaco editor */}
                <div className="flex-1 min-w-0">
                    <MonacoEditor
                        height="100%"
                        defaultLanguage="json"
                        value={json}
                        onChange={handleChange}
                        theme="vs-dark"
                        options={{
                            fontSize: 13,
                            lineNumbers: "on",
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            tabSize: 2,
                            formatOnPaste: true,
                            automaticLayout: true,
                        }}
                    />
                </div>

                {/* Validation sidebar */}
                <div className="w-80 border-l border-[var(--border-default)] bg-white flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--border-default)]">
                        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                            Validation
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Publish error */}
                        {publishError && (
                            <div className="text-xs bg-rose-50 text-[var(--accent-danger)] border border-rose-100 rounded-lg p-3">
                                <p className="font-semibold mb-0.5">Publish failed</p>
                                <p>{publishError}</p>
                            </div>
                        )}

                        {/* Repair changes */}
                        {repairChanges.length > 0 && (
                            <div className="text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                <p className="font-semibold text-[var(--accent-success)] mb-1.5">Repair applied</p>
                                {repairChanges.map((c, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-emerald-700 mt-1">
                                        <Check className="w-3 h-3 mt-0.5 shrink-0" />
                                        <span>{c}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Zod errors */}
                        {zodErrors.length > 0 && (
                            <div className="space-y-1.5">
                                {zodErrors.map((err, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="text-xs bg-rose-50 border border-rose-100 rounded-lg p-3"
                                    >
                                        <p className="font-semibold text-[var(--accent-danger)] font-mono">{err.path}</p>
                                        <p className="text-[var(--accent-danger)] mt-0.5">{err.message}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Warnings */}
                        {warnings.length > 0 && (
                            <div className="space-y-1.5">
                                {warnings.map((w, i) => (
                                    <div key={i} className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700">
                                        {w}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Valid state */}
                        {validationState === "valid" && zodErrors.length === 0 && repairChanges.length === 0 && (
                            <div className="text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[var(--accent-success)] flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                JSON is valid and ready to publish.
                            </div>
                        )}

                        {/* Idle state */}
                        {validationState === "idle" && (
                            <p className="text-xs text-[var(--text-secondary)] text-center py-4">
                                Start typing to validate
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ValidationPill({ state, errorCount }: { state: ValidationState; errorCount: number }) {
    if (state === "idle") {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                Waiting for input
            </span>
        );
    }
    if (state === "valid") {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-success)] bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                <CheckCircle2 className="w-3 h-3" />
                Valid JSON
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-danger)] bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1">
            <XCircle className="w-3 h-3" />
            {errorCount} error{errorCount !== 1 ? "s" : ""}
        </span>
    );
}
