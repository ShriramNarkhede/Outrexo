"use client";

import React, { useEffect, useState } from "react";
import { useCampaignStore } from "@/store/campaignStore";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
    id: string;
    name: string;
    subject: string;
    body: string;
}

export function TemplateSelector() {
    const { templateId, setTemplateId } = useCampaignStore();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/templates")
            .then((res) => res.json())
            .then((data) => {
                setTemplates(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
                <GlassPanel
                    key={template.id}
                    className={cn(
                        "cursor-pointer transition-all border-2 relative",
                        templateId === template.id ? "border-primary bg-primary/10" : "border-transparent hover:border-primary/50"
                    )}
                    onClick={() => setTemplateId(template.id)}
                >
                    {templateId === template.id && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                            <Check size={12} className="text-white" />
                        </div>
                    )}
                    <h3 className="font-bold mb-1">{template.name}</h3>
                    <p className="text-sm text-text-muted">{template.subject}</p>
                </GlassPanel>
            ))}
            {templates.length === 0 && (
                <div className="col-span-full text-center py-10 text-text-muted">
                    No templates found. <a href="/templates/new" className="text-primary hover:underline">Create one first</a>.
                </div>
            )}
        </div>
    );
}
