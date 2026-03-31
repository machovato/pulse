"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
    Copy, Check, Save, Bold, Italic, Underline, Strikethrough,
    Smartphone, Monitor, Briefcase, Hash, Globe, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePost } from "@/app/actions";
import { VoiceSetupDrawer } from "./VoiceSetupDrawer";

// ─── Unicode Formatting ────────────────────────────────────────────────────────

function toBold(text: string): string {
    return Array.from(text).map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1d5d4);
        if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1d5ee);
        if (code >= 48 && code <= 57) return String.fromCodePoint(code - 48 + 0x1d7ec);
        return c;
    }).join("");
}

function toItalic(text: string): string {
    return Array.from(text).map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1d608);
        if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1d622);
        return c;
    }).join("");
}

function toUnderline(text: string): string {
    return Array.from(text).map((c) => (c === " " || c === "\n" ? c : c + "\u0332")).join("");
}

function toStrikethrough(text: string): string {
    return Array.from(text).map((c) => (c === " " || c === "\n" ? c : c + "\u0336")).join("");
}

// ─── Hook detection ─────────────────────────────────────────────────────────────

const HOOK_LIMIT = 150;

function extractHook(text: string): string {
    const firstBreak = text.indexOf("\n\n");
    if (firstBreak >= 0 && firstBreak <= HOOK_LIMIT) return text.substring(0, firstBreak);
    if (text.length <= HOOK_LIMIT) return text;
    const capped = text.substring(0, HOOK_LIMIT);
    const lastSpace = capped.lastIndexOf(" ");
    return lastSpace > 0 ? capped.substring(0, lastSpace) : capped;
}

function extractHashtags(text: string): string[] {
    const lines = text.trimEnd().split("\n");
    const lastLine = lines[lines.length - 1]?.trim() || "";
    if (/^#\S+(\s+#\S+)*$/.test(lastLine)) {
        return lastLine.split(/\s+/).filter((t) => t.startsWith("#"));
    }
    return [];
}

// ─── Types ──────────────────────────────────────────────────────────────────────

interface LinkedInPostData {
    id: string;
    project: string;
    pillar: string;
    theme: string;
    hook: string;
    body: string;
    cta?: string | null;
    hashtags?: string[];
    hook_char_count: number;
    total_char_count: number;
    voice_version: string;
    status: string;
    created_at: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function LinkedInPostRenderer({ post }: { post: LinkedInPostData }) {
    const hashtagLine = post.hashtags?.length
        ? post.hashtags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")
        : "";
    const initialContent = [
        post.hook,
        post.body ? "\n\n" + post.body : "",
        post.cta ? "\n\n" + post.cta : "",
        hashtagLine ? "\n\n" + hashtagLine : "",
    ].join("");

    const [content, setContent] = useState(initialContent);
    const [feedMode, setFeedMode] = useState(true);
    const [mobileMode, setMobileMode] = useState(false); // default desktop
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dirty, setDirty] = useState(false);

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const hookText = useMemo(() => extractHook(content), [content]);
    const hookCharCount = Array.from(hookText).length;
    const hookOverLimit = hookCharCount > HOOK_LIMIT;
    const totalCharCount = Array.from(content).length;
    const parsedHashtags = useMemo(() => extractHashtags(content), [content]);

    const derivedHook = useMemo(() => {
        const i = content.indexOf("\n\n");
        return i >= 0 ? content.substring(0, i) : content;
    }, [content]);

    const derivedBody = useMemo(() => {
        const i = content.indexOf("\n\n");
        if (i < 0) return "";
        const afterHook = content.substring(i + 2);
        // Strip trailing hashtag-only paragraphs so they aren't double-stored in body
        const parts = afterHook.split("\n\n");
        while (parts.length > 0 && /^(\s*#\w+\s*)+$/.test(parts[parts.length - 1].trim())) {
            parts.pop();
        }
        return parts.join("\n\n");
    }, [content]);

    const applyFormat = useCallback((transform: (text: string) => string) => {
        const textarea = contentRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (start === end) return;
        const value = textarea.value;
        const transformed = transform(value.substring(start, end));
        setContent(value.substring(0, start) + transformed + value.substring(end));
        setDirty(true);
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + transformed.length);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const result = await updatePost(post.id, {
            hook: derivedHook,
            body: derivedBody,
            cta: null,
            hashtags: parsedHashtags,
        });
        setSaving(false);
        if (result.success) {
            setSaved(true);
            setDirty(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full">
            {/* Meta bar — outside the unified box */}
            <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full">
                    <Briefcase className="w-3 h-3" />{post.project}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full">
                    <Hash className="w-3 h-3" />{post.pillar}
                </span>
                <span className={cn(
                    "ml-auto text-xs font-semibold px-2.5 py-1 rounded-full",
                    post.status === "Draft" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                )}>
                    {post.status}
                </span>
            </div>

            {/* ─── Unified container ────────────────────────────────────────── */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">

                {/* Top toolbar — full width */}
                <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100">
                    <button onClick={() => applyFormat(toBold)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Bold">
                        <Bold className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyFormat(toItalic)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Italic">
                        <Italic className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyFormat(toUnderline)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Underline">
                        <Underline className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyFormat(toStrikethrough)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Strikethrough">
                        <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="w-px h-4 bg-gray-200 mx-2" />

                    {/* Above fold indicator — top right of toolbar */}
                    <span className="text-[11px] text-gray-400 shrink-0">Above fold</span>
                    <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden mx-2">
                        <div
                            className={cn("h-full rounded-full transition-all", hookOverLimit ? "bg-rose-400" : "bg-emerald-400")}
                            style={{ width: `${Math.min((hookCharCount / HOOK_LIMIT) * 100, 100)}%` }}
                        />
                    </div>
                    <span className={cn("text-[11px] font-mono tabular-nums shrink-0", hookOverLimit ? "text-rose-500 font-semibold" : "text-gray-400")}>
                        {hookCharCount}/{HOOK_LIMIT}
                    </span>

                    <div className="flex-1" />

                    {/* Device + Feed toggles — top right */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                            <button onClick={() => setFeedMode(true)} className={cn("text-xs font-medium px-2.5 py-1 rounded-md transition-all", feedMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}>
                                Feed View
                            </button>
                            <button onClick={() => setFeedMode(false)} className={cn("text-xs font-medium px-2.5 py-1 rounded-md transition-all", !feedMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")}>
                                Expanded View
                            </button>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                            <button onClick={() => setMobileMode(true)} className={cn("p-1.5 rounded-md transition-all", mobileMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")} title="Mobile">
                                <Smartphone className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setMobileMode(false)} className={cn("p-1.5 rounded-md transition-all", !mobileMode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600")} title="Desktop">
                                <Monitor className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two-column body */}
                <div className="flex min-h-[500px]">

                    {/* ─── Left: Editor (45%) ───────────────────────────────── */}
                    <div className="flex flex-col" style={{ width: "45%" }}>
                        <textarea
                            ref={contentRef}
                            value={content}
                            onChange={(e) => { setContent(e.target.value); setDirty(true); }}
                            className="flex-1 w-full text-[15px] text-gray-900 leading-relaxed px-6 py-5 resize-none focus:outline-none"
                            placeholder="Write your post..."
                            style={{
                                fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                minHeight: "460px",
                            }}
                        />
                    </div>

                    {/* Vertical divider */}
                    <div className="w-px bg-gray-100 shrink-0" />

                    {/* ─── Right: Preview (55%) ─────────────────────────────── */}
                    <div
                        className="flex flex-col items-center justify-start py-8 px-6"
                        style={{ width: "55%", backgroundColor: "#f4f2ee" }}
                    >
                        {/* LinkedIn card */}
                        <div
                            className={cn(
                                "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all w-full",
                                mobileMode ? "max-w-[320px]" : "max-w-[555px]"
                            )}
                        >
                            {/* Profile */}
                            <div className="px-4 pt-3 pb-2">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">T</div>
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-semibold text-gray-900 leading-tight">Tony Machado</p>
                                        <p className="text-xs text-gray-500 leading-tight mt-0.5">Director, Knowledge Strategy — AI and Automation</p>
                                        <p className="text-xs text-gray-400 leading-tight mt-0.5 flex items-center gap-1">
                                            12h · <Globe className="w-3 h-3" />
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Post text */}
                            <div className="px-4 pb-3">
                                <div
                                    className="text-[14px] text-gray-900 leading-[1.5] whitespace-pre-wrap"
                                    style={{ fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                                >
                                    {feedMode ? (
                                        <>
                                            {hookText}
                                            {content.length > hookText.length && (
                                                <button onClick={() => setFeedMode(false)} className="text-gray-500 hover:text-gray-700 ml-0.5">
                                                    …more
                                                </button>
                                            )}
                                        </>
                                    ) : content}
                                </div>
                            </div>

                            {/* Engagement — decorative */}
                            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100">
                                <span className="flex items-center gap-1.5">
                                    <span className="text-sm">👍❤️💡</span>
                                    <span>35</span>
                                </span>
                                <span>1 comment · 1 share</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar — full width */}
                <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                    <VoiceSetupDrawer />
                    
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-all",
                            copied
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                    >
                        {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy post</>}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!dirty || saving}
                        className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 rounded-lg transition-all",
                            saved ? "bg-emerald-500 text-white"
                                : dirty ? "bg-[var(--accent-primary)] text-white hover:opacity-90"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                            : saved ? <><Check className="w-4 h-4" /> Saved</>
                            : <><Save className="w-4 h-4" /> Save</>}
                    </button>

                    <span className="ml-auto text-xs text-gray-400">
                        {totalCharCount} chars · Created {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                </div>
            </div>
        </div>
    );
}
