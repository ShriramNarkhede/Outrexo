"use client";

import React, { useEffect, useState } from "react";
import { useCampaignStore } from "@/store/campaignStore";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Log {
    id: string;
    recipient: string;
    status: string;
}

interface SendingProgressProps {
    logs: Log[];
    campaignId: string;
}

export function SendingProgress({ logs, campaignId }: SendingProgressProps) {
    const { templateId } = useCampaignStore();
    const [progress, setProgress] = useState(0);
    const [sentCount, setSentCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [currentLogId, setCurrentLogId] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // We need the template body/subject to render the email for sending
    // Actually, sending logic requires the template details.
    // We should fetch template first once.
    const [template, setTemplate] = useState<{ subject: string; body: string } | null>(null);

    useEffect(() => {
        if (templateId) {
            fetch(`/api/templates/${templateId}`)
                .then(res => res.json())
                .then(data => setTemplate(data));
        }
    }, [templateId]);

    const processString = (str: string, recipientEmail: string) => {
        // Need contact details. Logs only have recipient email.
        // We should probably pass contacts from store or map logs to store contacts.
        // Or fetch contact details from somewhere.
        // For simplicity, we assume contacts in store match logs order or email.
        // Actually, logs array comes from `POST /api/campaigns`.
        // The store has `contacts`.

        // Let's find contact in store
        const { contacts } = useCampaignStore.getState();
        const contact = contacts.find(c => c.email === recipientEmail) || { email: recipientEmail };

        return str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            const normalizedKey = key.trim().toLowerCase();
            if (normalizedKey === 'name') return contact.name || contact.Name || "Friend";
            if (normalizedKey === 'company') return contact.company || contact.Company || "your company";
            if (normalizedKey === 'role') return contact.role || contact.Role || "professional";
            return contact[key.trim()] || `{{${key}}}`;
        });
    };

    const hasStarted = React.useRef(false);

    useEffect(() => {
        if (!template || isComplete || logs.length === 0 || hasStarted.current) return;

        hasStarted.current = true;

        const sendEmails = async () => {
            for (let i = 0; i < logs.length; i++) {
                const log = logs[i];
                setCurrentLogId(log.id);

                try {
                    // Random delay
                    const delay = Math.random() * 1000 + 1000; // 1-2s
                    await new Promise(r => setTimeout(r, delay));

                    let subject = "", htmlBody = "";
                    try {
                        subject = processString(template.subject, log.recipient);
                        htmlBody = processString(template.body, log.recipient);
                    } catch (strErr) {
                        console.error("Template processing error:", strErr);
                        // If template processing fails, we can't send.
                        // We should probably mark as failed and continue.
                        setFailCount(prev => prev + 1);
                        continue;
                    }

                    const res = await fetch("/api/email/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            to: log.recipient,
                            subject,
                            htmlBody,
                            campaignId,
                            logId: log.id
                        })
                    });

                    if (res.ok) {
                        setSentCount(prev => prev + 1);
                    } else {
                        console.error(`Failed to send to ${log.recipient}: ${res.status} ${res.statusText}`);
                        setFailCount(prev => prev + 1);
                    }
                } catch (err) {
                    // Catch network errors or other unexpected errors
                    setFailCount(prev => prev + 1);
                    console.error(`Unexpected error processing ${log.recipient}:`, err);
                }

                setProgress(((i + 1) / logs.length) * 100);
            }
            setIsComplete(true);
            setCurrentLogId(null);
        };

        sendEmails();
    }, [template, logs, campaignId]);

    return (
        <GlassPanel className="text-center py-10 space-y-6">
            <h2 className="text-2xl font-bold">
                {isComplete ? "Campaign Completed!" : "Sending Campaign..."}
            </h2>

            <div className="max-w-md mx-auto relative h-4 bg-surfaceHighlight rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primaryGlow transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex justify-center gap-8">
                <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{sentCount}</p>
                    <p className="text-sm text-text-muted">Sent</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-red-400">{failCount}</p>
                    <p className="text-sm text-text-muted">Failed</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-text-main">{logs.length - sentCount - failCount}</p>
                    <p className="text-sm text-text-muted">Pending</p>
                </div>
            </div>

            {isComplete && (
                <div className="pt-6">
                    <Link href="/campaigns">
                        <NeonButton>View Report</NeonButton>
                    </Link>
                </div>
            )}
        </GlassPanel>
    );
}
