
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Hero Skeleton */}
            <GlassPanel className="h-48 relative overflow-hidden border-primary/20">
                <div className="h-8 w-1/3 bg-white/5 rounded mb-4" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
            </GlassPanel>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <GlassCard key={i} className="h-32 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5" />
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-white/5 rounded" />
                            <div className="h-8 w-10 bg-white/5 rounded" />
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Recent Activity Skeleton */}
            <div className="space-y-4">
                <div className="h-6 w-40 bg-white/5 rounded" />
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <GlassCard key={i} className="h-24 flex items-center gap-4">
                            <div className="h-10 w-10 bg-white/5 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 bg-white/5 rounded" />
                                <div className="h-3 w-1/4 bg-white/5 rounded" />
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
