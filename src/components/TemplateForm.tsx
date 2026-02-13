"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { GlassPanel } from "./ui/GlassPanel";
import { InputField } from "./ui/InputField";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { NeonButton } from "./ui/NeonButton";
import { Eye, Edit, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

// ... existing imports

interface TemplateFormProps {
    initialData?: {
        id?: string;
        name: string;
        subject: string;
        body: string;
    };
    isEditing?: boolean;
}

export function TemplateForm({ initialData, isEditing = false }: TemplateFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        subject: initialData?.subject || "",
        body: initialData?.body || "",
    });

    // AI Generation State
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiTone, setAiTone] = useState("Professional");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [viewMode, setViewMode] = useState<"editor" | "preview">("editor");

    const tones = ["Professional", "Casual", "Bold", "Empathetic", "Persuasive"];

    // Mock data for preview
    const previewData = {
        Name: "John Doe",
        Company: "Acme Inc",
        Role: "CEO"
    };

    const getPreviewContent = (content: string) => {
        return content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            const k = key.trim();
            return (previewData as any)[k] || `{{${k}}}`;
        });
    };

    const generateAIContent = async () => {
        if (!aiPrompt) return;
        setIsGeneratingAI(true);
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt, tone: aiTone }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429 || res.status === 503) {
                    alert("AI is currently busy. Please try again in a few moments.");
                } else {
                    throw new Error(data.error || "Failed to generate content");
                }
                return;
            }

            setFormData(prev => ({ ...prev, body: data.content }));
            setShowAIModal(false);
            setAiPrompt("");
        } catch (error: unknown) {
            console.error("AI Generation failed", error);
            const errorMessage = (error as Error).message || "Failed to generate email content.";
            alert(errorMessage);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const insertVariable = (variable: string) => {
        setFormData((prev) => ({ ...prev, body: prev.body + ` {{${variable}}} ` }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing ? `/api/templates/${initialData?.id}` : "/api/templates";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save template");

            router.push("/templates");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/templates/${initialData?.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            router.push("/templates");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-6xl xl:max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Editor Column */}
                <div className={cn("flex-1 space-y-6", viewMode === "preview" ? "hidden lg:block" : "block")}>
                    <GlassPanel className="space-y-6">
                        <InputField
                            label="Template Name"
                            name="name"
                            placeholder="e.g. Software Engineer Pitch"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            label="Email Subject"
                            name="subject"
                            placeholder="e.g. Opportunity at Acme Corp"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />

                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <label className="text-sm font-medium text-text-muted">Email Body (HTML supported)</label>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setShowAIModal(true)}
                                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-blue-300 border border-blue-500/30 rounded hover:from-purple-500/30 hover:to-blue-500/30 transition-all"
                                    >
                                        <Sparkles size={12} />
                                        AI Auto-Write
                                    </button>
                                    <button type="button" onClick={() => insertVariable("Name")} className="px-2 py-1 bg-surfaceHighlight rounded hover:bg-primary/20 transition-colors">+ Name</button>
                                    <button type="button" onClick={() => insertVariable("Company")} className="px-2 py-1 bg-surfaceHighlight rounded hover:bg-primary/20 transition-colors">+ Company</button>
                                    <button type="button" onClick={() => insertVariable("Role")} className="px-2 py-1 bg-surfaceHighlight rounded hover:bg-primary/20 transition-colors">+ Role</button>
                                </div>
                            </div>
                            <textarea
                                name="body"
                                rows={18}
                                className="w-full bg-[#0F0F16] border border-border text-text-main rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-mono text-sm leading-relaxed"
                                placeholder="Hello {{Name}}, ..."
                                value={formData.body}
                                onChange={handleChange}
                                required
                            />
                            <p className="text-xs text-text-muted">Use {"{{Variable}}"} syntax for dynamic content.</p>
                        </div>
                    </GlassPanel>
                </div>

                {/* Preview Column */}
                <div className={cn("flex-1 lg:block", viewMode === "editor" ? "hidden" : "block")}>
                    <GlassPanel className="h-full flex flex-col bg-surfaceHighlight/30 border-primary/20">
                        <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Monitor size={16} /> Live Preview
                            </h3>
                            <span className="text-xs text-text-muted">Mock Data Applied</span>
                        </div>

                        <div className="flex-1 space-y-4 font-sans">
                            <div>
                                <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Subject</span>
                                <div className="text-white font-medium text-lg border-b border-white/5 pb-2">
                                    {getPreviewContent(formData.subject) || <span className="text-white/20 italic">No subject...</span>}
                                </div>
                            </div>
                            <div>
                                <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Body</span>
                                <div className="text-text-main whitespace-pre-wrap leading-relaxed">
                                    {getPreviewContent(formData.body) || <span className="text-white/20 italic">Start typing to see preview...</span>}
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden fixed bottom-24 right-6 z-50">
                <button
                    type="button"
                    onClick={() => setViewMode(viewMode === "editor" ? "preview" : "editor")}
                    className="bg-primary text-white p-4 rounded-full shadow-2xl border-2 border-white/10 hover:scale-105 transition-transform"
                >
                    {viewMode === "editor" ? <Eye size={24} /> : <Edit size={24} />}
                </button>
            </div>

            <div className="flex justify-end gap-4">
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-3 rounded-lg font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        disabled={loading}
                    >
                        Delete Template
                    </button>
                )}
                <Link href="/templates">
                    <button type="button" className="px-6 py-3 rounded-lg font-bold text-text-muted hover:text-white transition-colors">
                        Cancel
                    </button>
                </Link>
                <NeonButton type="submit" disabled={loading} className="min-w-[150px] flex justify-center">
                    {loading ? <Loader2 className="animate-spin" /> : isEditing ? "Update Template" : "Save Template"}
                </NeonButton>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Template"
                description="Are you sure you want to delete this template? This action cannot be undone."
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Delete Permanently
                        </button>
                    </div>
                }
            />

            {/* AI Generation Modal */}
            <Modal
                isOpen={showAIModal}
                onClose={() => setShowAIModal(false)}
                title="✨ AI Auto-Write"
                description="Describe what you want to say, and let AI draft the email for you."
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setShowAIModal(false)}
                            className="px-4 py-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <NeonButton
                            type="button"
                            onClick={generateAIContent}
                            disabled={isGeneratingAI || !aiPrompt.trim()}
                            className="min-w-[120px] flex justify-center"
                        >
                            {isGeneratingAI ? <Loader2 className="animate-spin" size={16} /> : "Generate"}
                        </NeonButton>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">What is this email about?</label>
                        <textarea
                            className="w-full bg-[#0F0F16] border border-border text-text-main rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                            rows={4}
                            placeholder="e.g. Ask a startup founder for a 15-min coffee chat about Next.js..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-muted">Select Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {tones.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setAiTone(t)}
                                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${aiTone === t
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-surfaceHighlight border-transparent text-text-muted hover:bg-surfaceHighlight/80"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </form>
    );
}
