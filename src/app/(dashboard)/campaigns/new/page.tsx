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
import { Modal } from "@/components/ui/Modal";
import { CheckCircle2 } from "lucide-react";

const steps = [
    { id: 1, name: "Upload Data" },
    { id: 2, name: "Select Template" },
    { id: 3, name: "Preview & Launch" },
    { id: 4, name: "Sending..." },
];

import { useSearchParams } from "next/navigation";



export default function NewCampaignPage() {
    const searchParams = useSearchParams();
    const { step, setStep, file, templateId, campaignName, setCampaignName, contacts, reset } = useCampaignStore();
    const [launchedCampaign, setLaunchedCampaign] = useState<{ id: string, logs: any[] } | null>(null);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; description: string }>({
        isOpen: false,
        title: "",
        description: "",
    });

    // Reset store on mount unless coming from converter
    useEffect(() => {
        if (searchParams.get("from") !== "converter") {
            reset();
        }
    }, [searchParams]);

    const showModal = (title: string, description: string) => {
        setModalConfig({ isOpen: true, title, description });
    };

    const closeModal = () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
    };

    const nextStep = () => {
        if (step === 1 && !file) return showModal("Missing File", "Please upload a contact list (CSV/Excel) to proceed.");
        if (step === 1 && !campaignName) return showModal("Missing Name", "Please provide a name for your campaign.");
        if (step === 2 && !templateId) return showModal("Missing Template", "Please select an email template to proceed.");
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
            showModal("Launch Failed", error.message || "An unexpected error occurred while launching the campaign.");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                description={modalConfig.description}
            />

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

            {step < 4 && (
                <div className="fixed bottom-6 right-6 z-50">
                    {step < 3 && (
                        <NeonButton
                            onClick={nextStep}
                            className="px-8 py-4 text-lg shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
                        >
                            Next Step
                        </NeonButton>
                    )}
                </div>
            )}

            {/* Navigation (Back button only) */}
            {step < 4 && (
                <div className="flex justify-start mt-8 border-t border-border pt-6">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${step === 1 ? "opacity-0 cursor-default" : "text-text-muted hover:text-white"
                            }`}
                    >
                        Back
                    </button>
                </div>
            )}
        </div>
    );
}
