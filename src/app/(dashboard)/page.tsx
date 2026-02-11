import { auth } from "@/auth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatsGridSkeleton, RecentActivitySkeleton } from "@/components/skeletons";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <GlassPanel className="relative overflow-hidden border-primary/20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 bg-center" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-2">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{session.user.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Check your campaign performance and launch new outreach.
            </p>
          </div>
          <Link href="/campaigns/new">
            <NeonButton className="flex items-center gap-2 px-6 py-3">
              <Plus size={20} />
              New Campaign
            </NeonButton>
          </Link>
        </div>
      </GlassPanel>

      {/* Stats Grid */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>

      {/* Recent Activity */}
      <Suspense fallback={<RecentActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
