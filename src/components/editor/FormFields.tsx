import React, { useState, useEffect, useRef } from "react";
import { Reorder, useDragControls } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Input Primitives ────────────────────────────────────────────────────────

export function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {label}
            </label>
            {children}
            {error && <span className="text-[10px] text-[var(--accent-danger)] mt-0.5">{error}</span>}
        </div>
    );
}

export function TextField({
    label,
    value,
    onChange,
    placeholder,
    error,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    error?: string;
    maxLength?: number;
}) {
    return (
        <FormField label={label} error={error}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className={cn(
                    "w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-shadow",
                    error
                        ? "border-[var(--accent-danger)] focus:ring-2 focus:ring-[var(--accent-danger)]/20"
                        : "border-[var(--border-default)] focus:border-[var(--accent-info)] focus:ring-2 focus:ring-[var(--accent-info)]/20"
                )}
            />
        </FormField>
    );
}

export function TextAreaField({
    label,
    value,
    onChange,
    placeholder,
    error,
    wordLimit,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    error?: string;
    wordLimit?: number;
    rows?: number;
}) {
    // Derive internal state to ensure live typing updates for the counter instantly
    const [localValue, setLocalValue] = useState(value);

    // Keep it synchronized if external value changes (e.g. on mount or other edits)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setLocalValue(val);
        onChange(val); // Propagate to parent
    };

    const wordCount = localValue.trim() ? localValue.trim().split(/\s+/).length : 0;
    const isOverLimit = wordLimit ? wordCount > wordLimit : false;

    return (
        <FormField label={label} error={error}>
            <div className="relative">
                <textarea
                    value={localValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={cn(
                        "w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-shadow resize-y",
                        error
                            ? "border-[var(--accent-danger)] focus:ring-2 focus:ring-[var(--accent-danger)]/20"
                            : "border-[var(--border-default)] focus:border-[var(--accent-info)] focus:ring-2 focus:ring-[var(--accent-info)]/20",
                        isOverLimit && !error && "border-orange-400 focus:border-orange-500 focus:ring-orange-500/20" // Soft warning
                    )}
                />
                {wordLimit && (
                    <div
                        className={cn(
                            "absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded transition-colors",
                            isOverLimit
                                ? "bg-orange-100 text-orange-700 font-medium"
                                : "bg-gray-100 text-gray-500"
                        )}
                    >
                        {wordCount} / {wordLimit}
                    </div>
                )}
            </div>
        </FormField>
    );
}

export function SelectField({
    label,
    value,
    options,
    onChange,
    error,
}: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (val: string) => void;
    error?: string;
}) {
    return (
        <FormField label={label} error={error}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-shadow appearance-none custom-select-arrow",
                    error
                        ? "border-[var(--accent-danger)] focus:ring-2 focus:ring-[var(--accent-danger)]/20"
                        : "border-[var(--border-default)] focus:border-[var(--accent-info)] focus:ring-2 focus:ring-[var(--accent-info)]/20"
                )}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <style jsx>{`
                .custom-select-arrow {
                    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
            `}</style>
        </FormField>
    );
}

const CURATED_ICONS = [
    "AlertCircle", "AlertTriangle", "ArrowUpCircle", "Bot", "CheckCircle", "CheckSquare",
    "Eye", "GitBranch", "Layers", "Lock", "Map", "Rocket", "Shield", "TrendingDown", "TrendingUp",
    "UserMinus", "UserPlus", "Users", "XCircle", "Activity", "Award", "BarChart", "Bell",
    "Briefcase", "Calendar", "Clock", "Cloud", "Compass", "Cpu", "CreditCard", "Database",
    "FileText", "Flag", "Globe", "Heart", "Key", "Link", "MessageSquare", "Monitor", "PieChart",
    "Search", "Server", "Settings", "Star", "Target", "Tool", "Zap", "Info", "HelpCircle", "Circle"
];

// Curated dropdown implementation for selecting presentations icons
export function IconField({
    label,
    value,
    onChange,
    error,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    error?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const CurrentIcon = (Icons as any)[value] || Icons.Circle; // Default fallback

    return (
        <FormField label={label} error={error}>
            <div className="relative" ref={containerRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-shadow flex items-center justify-between",
                        error
                            ? "border-[var(--accent-danger)] focus:ring-2 focus:ring-[var(--accent-danger)]/20"
                            : "border-[var(--border-default)] hover:border-gray-400 focus:border-[var(--accent-info)] focus:ring-2 focus:ring-[var(--accent-info)]/20"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <CurrentIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{value || "Select Icon"}</span>
                    </div>
                    <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        <div className="flex flex-col">
                            {CURATED_ICONS.map((iconName) => {
                                const IconComp = (Icons as any)[iconName];
                                if (!IconComp) return null;
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        title={iconName}
                                        onClick={() => {
                                            onChange(iconName);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors",
                                            value === iconName ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                        )}
                                    >
                                        <IconComp className={cn("w-4 h-4 mr-3 shrink-0", value === iconName ? "text-blue-600" : "text-gray-500")} />
                                        <span className="truncate">{iconName}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {/* Inline style for the custom scrollbar in the dropdown to keep it clean */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </FormField>
    );
}

// ─── Repeatable Group ─────────────────────────────────────────────────────────

export function RepeatableGroup<T extends { id: string }>({
    items,
    onReorder,
    onRemove,
    onAdd,
    renderItem,
    addButtonText = "Add Item",
}: {
    items: T[];
    onReorder: (newOrder: T[]) => void;
    onRemove: (id: string) => void;
    onAdd: () => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    addButtonText?: string;
}) {
    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...items];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        onReorder(newOrder);
    };

    const handleMoveDown = (index: number) => {
        if (index === items.length - 1) return;
        const newOrder = [...items];
        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        onReorder(newOrder);
    };

    return (
        <div className="space-y-3">
            <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-3">
                {items.map((item, index) => (
                    <RepeatableItem
                        key={item.id}
                        item={item}
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                        onRemove={() => onRemove(item.id)}
                        onMoveUp={() => handleMoveUp(index)}
                        onMoveDown={() => handleMoveDown(index)}
                    >
                        {renderItem(item, index)}
                    </RepeatableItem>
                ))}
            </Reorder.Group>

            <button
                type="button"
                onClick={onAdd}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-[var(--accent-info)] hover:bg-[var(--accent-info)]/5 border border-[var(--accent-info)]/20 rounded-md transition-colors border-dashed"
            >
                <Icons.Plus className="w-4 h-4" />
                {addButtonText}
            </button>
        </div>
    );
}

function RepeatableItem({
    item,
    isFirst,
    isLast,
    onRemove,
    onMoveUp,
    onMoveDown,
    children,
}: {
    item: any;
    isFirst?: boolean;
    isLast?: boolean;
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    children: React.ReactNode;
}) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={dragControls}
            className="flex gap-2 p-3 bg-gray-50 border border-[var(--border-default)] rounded-md group relative"
        >
            <div className="flex flex-col items-center gap-1 mt-1">
                <div
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <Icons.GripVertical className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-center mt-2 -space-y-1">
                    {!isFirst && onMoveUp && (
                        <button
                            type="button"
                            onClick={onMoveUp}
                            className="text-gray-400 hover:text-[var(--accent-info)] transition-colors p-1"
                            title="Move up"
                        >
                            <Icons.ChevronUp className="w-4 h-4" />
                        </button>
                    )}
                    {!isLast && onMoveDown && (
                        <button
                            type="button"
                            onClick={onMoveDown}
                            className="text-gray-400 hover:text-[var(--accent-info)] transition-colors p-1"
                            title="Move down"
                        >
                            <Icons.ChevronDown className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 space-y-3 pt-0.5">
                {children}
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="text-gray-400 hover:text-[var(--accent-danger)] transition-colors mt-0.5"
                title="Remove item"
            >
                <Icons.X className="w-4 h-4" />
            </button>
        </Reorder.Item>
    );
}
