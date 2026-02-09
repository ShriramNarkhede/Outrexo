"use client";

import { useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function SmtpForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // Form state
    const [host, setHost] = useState("smtp.gmail.com");
    const [port, setPort] = useState("465");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch("/api/settings/smtp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ host, port, user, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || "Failed to save settings");
            }

            setStatus("success");
            setMessage("Connected successfully!");
            // Optional: clear password field
            // setPassword(""); 

        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-text-muted uppercase font-bold">SMTP Host</label>
                    <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="smtp.gmail.com"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-text-muted uppercase font-bold">Port</label>
                    <input
                        type="number"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="465"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs text-text-muted uppercase font-bold">Email User</label>
                <input
                    type="email"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary"
                    placeholder="john@gmail.com"
                    required
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs text-text-muted uppercase font-bold">App Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary"
                    placeholder="••••••••••••••••"
                    required
                />
            </div>

            {/* Status Messages */}
            {status === "error" && (
                <div className="text-red-400 text-xs flex items-center gap-2 bg-red-500/10 p-2 rounded">
                    <AlertCircle size={14} />
                    {message}
                </div>
            )}
            {status === "success" && (
                <div className="text-green-400 text-xs flex items-center gap-2 bg-green-500/10 p-2 rounded">
                    <Check size={14} />
                    {message}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-bold flex items-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Save & Verify Connection
                </button>
            </div>
        </form>
    );
}
