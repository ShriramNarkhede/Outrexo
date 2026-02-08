import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export async function CampaignsList() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const campaigns = await prisma.campaign.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            _count: {
                select: { logs: true }
            }
        }
    });

    if (campaigns.length === 0) {
        return (
            <GlassPanel className="py-20 text-center">
                <p className="text-text-muted text-lg mb-6">No campaigns yet. Launch your first one!</p>
                <Link href="/campaigns/new">
                    <NeonButton variant="secondary">Start Campaign</NeonButton>
                </Link>
            </GlassPanel>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {campaigns.map((campaign: any) => {
                const total = campaign._count.logs;
                const sent = campaign.sentCount;
                const failed = campaign.failCount;
                const pending = total - sent - failed;

                // Calculate success rate
                const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;

                return (
                    <Link href={`/campaigns/${campaign.id}`} key={campaign.id}>
                        <GlassPanel className="group hover:border-primary/30 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${campaign.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                                        campaign.status === 'IN_PROGRESS' ? 'bg-primary/20 text-primary' :
                                            'bg-surfaceHighlight text-text-muted'
                                        }`}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold">{campaign.name}</h3>
                                            <ExternalLink size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm text-text-muted">
                                            {new Date(campaign.createdAt).toLocaleDateString()} at {new Date(campaign.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto">
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-sm text-text-muted mb-1">Total</p>
                                        <p className="font-bold text-lg">{total}</p>
                                    </div>
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-sm text-text-muted mb-1">Sent</p>
                                        <p className="font-bold text-lg text-green-400">{sent}</p>
                                    </div>
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-sm text-text-muted mb-1">Failed</p>
                                        <p className="font-bold text-lg text-red-400">{failed}</p>
                                    </div>
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-sm text-text-muted mb-1">Success</p>
                                        <p className="font-bold text-lg text-primary">{successRate}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Progress Bar */}
                            <div className="mt-6 h-2 bg-surfaceHighlight rounded-full overflow-hidden flex">
                                <div style={{ width: `${(sent / total) * 100}%` }} className="bg-green-500 h-full" />
                                <div style={{ width: `${(failed / total) * 100}%` }} className="bg-red-500 h-full" />
                            </div>
                        </GlassPanel>
                    </Link>
                );
            })}
        </div>
    );
}
