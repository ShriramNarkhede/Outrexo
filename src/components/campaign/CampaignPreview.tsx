"use client";

import React, { useState, useEffect } from "react";
import { useCampaignStore } from "@/store/campaignStore";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface CampaignPreviewProps {
    onLaunch: () => void;
}

export function CampaignPreview({ onLaunch }: CampaignPreviewProps) {
    const { contacts, templateId, campaignName } = useCampaignStore();
    const [template, setTemplate] = useState<{ subject: string; body: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (templateId) {
            fetch(`/api/templates/${templateId}`)
                .then(res => res.json())
                .then(data => setTemplate(data))
                .catch(err => console.error(err));
        }
    }, [templateId]);

    const previewContact = contacts[0] || {};

    const processString = (str: string) => {
        if (!str) return "";
        return str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            const normalizedKey = key.trim().toLowerCase();
            // Simple fuzzy match logic similar to FileUpload
            if (normalizedKey === 'name') return previewContact.name || previewContact.Name || "Friend";
            if (normalizedKey === 'company') return previewContact.company || previewContact.Company || "your company";
            if (normalizedKey === 'role') return previewContact.role || previewContact.Role || "professional";
            return previewContact[key.trim()] || `{{${key}}}`;
        });
    };

    const handleLaunch = async () => {
        if (!campaignName) {
            alert("Please provide a name for the campaign.");
            return;
        }
        setLoading(true);
        await onLaunch();
        setLoading(false);
    };

    if (!template) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <GlassPanel>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Preview (1 of {contacts.length})</h3>
                    <span className="text-xs bg-surfaceHighlight px-2 py-1 rounded text-text-muted">Random sample</span>
                </div>
                <div className="bg-white/5 p-6 rounded-lg space-y-4 border border-border">
                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                        <span className="text-text-muted text-sm font-medium">To:</span>
                        <span className="text-white bg-black/20 px-2 py-1 rounded inline-block w-fit">{previewContact.email}</span>

                        <span className="text-text-muted text-sm font-medium">Subject:</span>
                        <span className="text-white font-medium">{processString(template.subject)}</span>
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-4 text-text-main whitespace-pre-wrap font-sans leading-relaxed">
                        {processString(template.body)}
                    </div>
                </div>
            </GlassPanel>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <div className="text-yellow-200 text-sm">
                    <span className="font-bold">Ready to launch?</span> This will verify emails and add them to queue.
                </div>
                <NeonButton onClick={handleLaunch} disabled={loading} className="w-full sm:w-auto flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    Launch Campaign
                </NeonButton>
            </div>
        </div>
    );
}
