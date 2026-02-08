"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { InputField } from "@/components/ui/InputField";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        subject: initialData?.subject || "",
        body: initialData?.body || "",
    });

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

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this template?")) return;
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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
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
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-text-muted">Email Body (HTML supported)</label>
                        <div className="flex gap-2 text-xs">
                            <button type="button" onClick={() => insertVariable("Name")} className="px-2 py-1 bg-surfaceHighlight rounded hover:bg-primary/20 transition-colors">+ Name</button>
                            <button type="button" onClick={() => insertVariable("Company")} className="px-2 py-1 bg-surfaceHighlight rounded hover:bg-primary/20 transition-colors">+ Company</button>
                            <button type="button" onClick={() => insertVariable("Role")} className="px-2 py-1 bg-surfaceHighlight rounded hover:bg-primary/20 transition-colors">+ Role</button>
                        </div>
                    </div>
                    <textarea
                        name="body"
                        rows={12}
                        className="w-full bg-[#0F0F16] border border-border text-text-main rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all font-mono text-sm"
                        placeholder="Hello {{Name}}, ..."
                        value={formData.body}
                        onChange={handleChange}
                        required
                    />
                    <p className="text-xs text-text-muted">Use {"{{Variable}}"} syntax for dynamic content.</p>
                </div>
            </GlassPanel>

            <div className="flex justify-end gap-4">
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleDelete}
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
        </form>
    );
}
