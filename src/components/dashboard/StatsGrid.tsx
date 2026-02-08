import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, FileText, BarChart3, Clock } from "lucide-react";

export async function StatsGrid() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const [campaignsCount, templatesCount, emailStats] = await Promise.all([
        prisma.campaign.count({ where: { userId: session.user.id } }),
        prisma.template.count({ where: { userId: session.user.id } }),
        prisma.campaign.aggregate({
            where: { userId: session.user.id },
            _sum: {
                sentCount: true,
                failCount: true
            }
        }),
    ]);

    const totalSent = emailStats._sum.sentCount || 0;
    const totalFailed = emailStats._sum.failCount || 0;
    const totalEmails = totalSent + totalFailed;
    const successRate = totalEmails > 0 ? Math.round((totalSent / totalEmails) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="flex items-center gap-4 group">
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Send size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-sm tracking-widest uppercase mb-1">Emails Sent</p>
                    <p className="text-3xl font-bold text-white">{totalSent}</p>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 group">
                <div className="p-3 bg-secondary/10 rounded-xl text-secondary group-hover:bg-secondary group-hover:text-black transition-colors duration-300">
                    <FileText size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-sm tracking-widest uppercase mb-1">Templates</p>
                    <p className="text-3xl font-bold text-white">{templatesCount}</p>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 group">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                    <BarChart3 size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-sm tracking-widest uppercase mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-white">{successRate}%</p>
                </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4 group">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-sm tracking-widest uppercase mb-1">Campaigns</p>
                    <p className="text-3xl font-bold text-white">{campaignsCount}</p>
                </div>
            </GlassCard>
        </div>
    );
}
