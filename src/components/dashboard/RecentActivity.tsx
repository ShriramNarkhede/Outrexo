import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Send } from "lucide-react";
import Link from "next/link";

export async function RecentActivity() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const recentCampaigns = await prisma.campaign.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-wide">RECENT ACTIVITY</h2>
            {recentCampaigns.length === 0 ? (
                <GlassPanel className="text-center py-10 text-slate-500">
                    No recent activity.
                </GlassPanel>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {recentCampaigns.map((c: any) => {
                        const total = c.sentCount + c.failCount;
                        const progress = total > 0 ? (c.sentCount / total) * 100 : 0;
                        return (
                            <Link href={`/campaigns/${c.id}`} key={c.id}>
                                <GlassCard className="flex flex-col md:flex-row justify-between items-center gap-4 group hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4 w-full md:w-1/3">
                                        <div className={`w-2 h-2 rounded-full ${c.status === 'COMPLETED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(102,79,199,0.5)]'}`} />
                                        <div>
                                            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{c.name}</h3>
                                            <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full md:w-1/3 px-4">
                                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                                            <span>Progress</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 shadow-[0_0_10px_rgba(102,79,199,0.5)]"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-1/3 justify-end">
                                        <div className="text-right">
                                            <p className="font-bold text-white">{c.sentCount} / <span className="text-slate-500">{total}</span></p>
                                            <p className="text-xs text-slate-400">Emails Sent</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                                            <Send size={16} />
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
