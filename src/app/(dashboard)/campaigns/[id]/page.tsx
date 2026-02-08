"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import {
    ArrowLeft,
    Mail,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Trash2,
    Loader2,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

interface Log {
    id: string;
    recipient: string;
    status: string;
    error: string | null;
    sentAt: string;
}

interface Campaign {
    id: string;
    name: string;
    status: string;
    sentCount: number;
    failCount: number;
    createdAt: string;
    logs: Log[];
}

export default function CampaignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await fetch(`/api/campaigns/${params.id}`);
                if (!res.ok) throw new Error("Failed to fetch campaign");
                const data = await res.json();
                setCampaign(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [params.id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this campaign? This will also delete all associated logs.")) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/campaigns/${params.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete campaign");
            router.push("/campaigns");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete campaign");
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
                <Link href="/campaigns">
                    <NeonButton>Back to Campaigns</NeonButton>
                </Link>
            </div>
        );
    }

    const totalLogs = campaign.logs.length;
    // Handle potential data inconsistency where sentCount > logs.length
    const totalProcessed = campaign.sentCount + campaign.failCount;
    const total = Math.max(totalLogs, totalProcessed);

    const pending = Math.max(0, total - totalProcessed);
    const successRate = total > 0 ? Math.round((campaign.sentCount / total) * 100) : 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/campaigns" className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors text-text-muted hover:text-white">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{campaign.name}</h1>
                        <p className="text-text-muted mt-1">
                            Launched on {new Date(campaign.createdAt).toLocaleDateString()} at {new Date(campaign.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                >
                    {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    Delete Campaign
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassPanel className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Sent</p>
                        <p className="text-2xl font-bold">{campaign.sentCount}</p>
                    </div>
                </GlassPanel>

                <GlassPanel className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-lg text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Failed</p>
                        <p className="text-2xl font-bold">{campaign.failCount}</p>
                    </div>
                </GlassPanel>

                <GlassPanel className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-lg text-primary">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Pending</p>
                        <p className="text-2xl font-bold">{pending}</p>
                    </div>
                </GlassPanel>

                <GlassPanel className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/20 rounded-lg text-secondary">
                        <Mail size={24} />
                    </div>
                    <div>
                        <p className="text-text-muted text-sm">Success Rate</p>
                        <p className="text-2xl font-bold">{successRate}%</p>
                    </div>
                </GlassPanel>
            </div>

            {/* Logs Table */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Email Logs</h2>
                <GlassPanel className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surfaceHighlight/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Recipient</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Sent At</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-text-muted uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {campaign.logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium">{log.recipient}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === 'SENT' ? 'bg-green-500/20 text-green-400' :
                                                log.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-primary/20 text-primary'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted">
                                            {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {log.error ? (
                                                <span className="text-red-400 truncate max-w-[200px] inline-block" title={log.error}>
                                                    {log.error}
                                                </span>
                                            ) : (
                                                <span className="text-text-muted">Success</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {campaign.logs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-text-muted">
                                            No logs found for this campaign.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
