"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, AlertCircle, Lock, Unlock, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SmtpForm() {
    const [loading, setLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [host, setHost] = useState("smtp.gmail.com");
    const [port, setPort] = useState("465");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    // Effect to auto-lock if fields are pre-filled
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings/smtp");
                if (res.ok) {
                    const data = await res.json();
                    if (data.configured) {
                        setHost(data.host || "smtp.gmail.com");
                        setPort(data.port || 465);
                        setUser(data.user || "");
                        // We use a dummy password to indicate it's set, but user must re-enter to change
                        setPassword(data.hasPassword ? "••••••••••••••••" : "");
                        setIsLocked(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load SMTP settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // If password is the dummy placeholder, don't send it? 
            // Actually API should handle "if password empty, don't update" or frontend should force re-entry.
            // Simplified: We force re-entry if unlocked usually, or we keep it. 
            // But if user clicks "Save" without changing password (and it's dummy), we need to handle that.
            // For now, if locked, they can't submit. If unlocked, they MUST enter password if they want to update it.
            // But if they just want to update PORT, re-entering password is annoying.
            // However, for security, let's assume if they unlock, they might need to re-enter.
            // Let's check if password is the placeholder.

            const payload: any = { host, port, user };
            if (password && password !== "••••••••••••••••") {
                payload.password = password;
            } else if (password === "••••••••••••••••") {
                // If it's placeholder, we don't send password, API should keep existing?
                // My API currently requires password. I should probably update API to make password optional on update if it exists.
                // OR simpler: User must re-enter password to verify connection.
                // "Save & Verify" implies testing the connection. We need the raw password to test connection.
                // We cannot test connection with a hashed password or without sending it.
                // So, if they edit, they MUST re-enter password.
                if (!isLocked) { // If manually submitting
                    setError("Please re-enter your App Password to verify and save.");
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch("/api/settings/smtp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ host, port, user, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || "Failed to save settings");
            }

            setIsLocked(true);
            setShowSuccessDialog(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = () => {
        setIsLocked(false);
        setError("");
        setPassword(""); // Clear placeholder so they know to re-enter
    };

    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded text-purple-400">
                        <Mail size={18} />
                    </div>
                    <div>
                        <p className="font-medium">Manual SMTP Configuration</p>
                        
                    </div>
                </div>

                {/* Edit Button */}
                {isLocked && (
                    <button
                        onClick={handleUnlock}
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20"
                    >
                        <Unlock size={14} />
                        Edit Credentials
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className={`space-y-4 mt-4 pt-4 border-t border-border/50 transition-opacity ${isLocked ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-text-muted uppercase font-bold">SMTP Host</label>
                        <input
                            type="text"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary disabled:cursor-not-allowed"
                            placeholder="smtp.gmail.com"
                            required
                            disabled={isLocked}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-text-muted uppercase font-bold">Port</label>
                        <input
                            type="number"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary disabled:cursor-not-allowed"
                            placeholder="465"
                            required
                            disabled={isLocked}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-text-muted uppercase font-bold">Email User</label>
                    <input
                        type="email"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary disabled:cursor-not-allowed"
                        placeholder="john@gmail.com"
                        required
                        disabled={isLocked}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-text-muted uppercase font-bold">App Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded p-2 text-sm focus:outline-none focus:border-primary disabled:cursor-not-allowed"
                            placeholder="••••••••••••••••"
                            required
                            disabled={isLocked}
                        />
                        {isLocked && (
                            <div className="absolute inset-y-0 right-3 flex items-center text-green-500">
                                <Check size={16} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs flex items-center gap-2 bg-red-500/10 p-3 rounded-md border border-red-500/20"
                    >
                        <AlertCircle size={16} />
                        <div>
                            <span className="font-bold">Connection Failed:</span> {error}
                            <div className="mt-1 text-red-300/70">Please check your credentials and try again.</div>
                        </div>
                    </motion.div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || isLocked}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-bold flex items-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Save & Verify Connection
                    </button>
                </div>
            </form>

            {/* Success Dialog */}
            <AnimatePresence>
                {showSuccessDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1A1A1A] border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-[50px] pointer-events-none" />

                            <button
                                onClick={() => setShowSuccessDialog(false)}
                                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20 text-green-500">
                                    <Check size={32} strokeWidth={3} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Connected Successfully!</h3>
                                <p className="text-text-muted text-sm mb-6">
                                    Your SMTP credentials have been verified and saved. You can now send emails using this configuration.
                                </p>

                                <button
                                    onClick={() => setShowSuccessDialog(false)}
                                    className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-900/20"
                                >
                                    Awesome, Continue
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
