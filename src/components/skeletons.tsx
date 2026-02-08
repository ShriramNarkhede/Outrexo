import { GlassCard } from "@/components/ui/GlassCard";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <GlassCard key={i} className="flex items-center gap-4 h-24 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-white/5" />
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-white/5 rounded" />
                        <div className="h-8 w-16 bg-white/5 rounded" />
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}

export function RecentActivitySkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-7 w-48 bg-white/5 rounded animate-pulse mb-6" />
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <GlassCard key={i} className="h-28 animate-pulse bg-white/5">
                        <div />
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}

export function CampaignsListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <GlassPanel key={i} className="h-32 animate-pulse bg-white/5">
                    <div />
                </GlassPanel>
            ))}
        </div>
    )
}
