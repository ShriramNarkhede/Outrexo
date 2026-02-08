"use client";

import React, { useEffect, useState } from "react";
import { useCampaignStore } from "@/store/campaignStore";
import { FileUpload } from "@/components/campaign/FileUpload";
import { TemplateSelector } from "@/components/campaign/TemplateSelector";
import { CampaignPreview } from "@/components/campaign/CampaignPreview";
import { SendingProgress } from "@/components/campaign/SendingProgress";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { InputField } from "@/components/ui/InputField";
import { NeonButton } from "@/components/ui/NeonButton";
import { CheckCircle2 } from "lucide-react";

const steps = [
    { id: 1, name: "Upload Data" },
    { id: 2, name: "Select Template" },
    { id: 3, name: "Preview & Launch" },
    { id: 4, name: "Sending..." },
];

export default function NewCampaignPage() {
    const { step, setStep, file, templateId, campaignName, setCampaignName, contacts, reset } = useCampaignStore();
    const [launchedCampaign, setLaunchedCampaign] = useState<{ id: string, logs: any[] } | null>(null);

    // Reset store on mount
    useEffect(() => {
        reset();
    }, []);

    const nextStep = () => {
        if (step === 1 && !file) return alert("Please upload a file");
        if (step === 1 && !campaignName) return alert("Please name your campaign");
        if (step === 2 && !templateId) return alert("Please select a template");
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleLaunch = async () => {
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: campaignName,
                    templateId,
                    contacts: contacts.map(c => ({
                        email: c.email,
                        name: c.name,
                        company: c.company,
                        role: c.role
                    }))
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to launch campaign");
            }

            const data = await res.json();
            setLaunchedCampaign(data);
            setStep(4);
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to launch campaign");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Stepper */}
            <div className="flex justify-between items-center relative mb-12">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surfaceHighlight -z-10" />
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-4">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s.id
                                    ? "bg-primary border-primary text-white"
                                    : "bg-surface border-border text-text-muted"
                                }`}
                        >
                            {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                        </div>
                        <span className={`text-sm ${step >= s.id ? "text-white" : "text-text-muted"}`}>
                            {s.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Campaign Name Input (Step 1) */}
            {step === 1 && (
                <div className="max-w-md mx-auto mb-8">
                    <InputField
                        label="Campaign Name"
                        placeholder="e.g. Q1 Outreach"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        autoFocus
                    />
                </div>
            )}

            {/* Step Content */}
            <div className="min-h-[400px]">
                {step === 1 && <FileUpload />}
                {step === 2 && <TemplateSelector />}
                {step === 3 && <CampaignPreview onLaunch={handleLaunch} />}
                {step === 4 && launchedCampaign && (
                    <SendingProgress logs={launchedCampaign.logs} campaignId={launchedCampaign.id} />
                )}
            </div>

            {/* Navigation */}
            {step < 4 && (
                <div className="flex justify-between mt-8 border-t border-border pt-6">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${step === 1 ? "opacity-0 cursor-default" : "text-text-muted hover:text-white"
                            }`}
                    >
                        Back
                    </button>

                    {step < 3 && (
                        <NeonButton onClick={nextStep}>
                            Next Step
                        </NeonButton>
                    )}
                </div>
            )}
        </div>
    );
}
