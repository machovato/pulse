"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/history";
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret }),
        });

        if (res.ok) {
            router.push(redirect);
        } else {
            setError("Invalid secret. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--surface-primary)] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-10 h-10 bg-[var(--text-primary)] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        P
                    </div>
                    <span className="font-bold text-[var(--text-primary)] text-xl">Project Pulse</span>
                </div>

                <div className="card p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Lock className="w-6 h-6 text-[var(--accent-primary)]" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)] text-center mb-1">
                        Editor Access
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
                        Enter your admin secret to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                Admin Secret
                            </label>
                            <div className="relative">
                                <input
                                    type={show ? "text" : "password"}
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    placeholder="Enter your secret…"
                                    className="w-full border border-[var(--border-default)] rounded-lg px-3 py-2.5 pr-10 text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                                >
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-xs text-[var(--accent-danger)] bg-rose-50 border border-rose-100 rounded-lg p-2.5">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!secret || loading}
                            className="w-full bg-[var(--accent-primary)] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? "Checking…" : "Continue"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
                    /deck/[id] links are always publicly accessible.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--surface-primary)]" />}>
            <LoginForm />
        </Suspense>
    );
}
