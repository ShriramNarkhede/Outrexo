import { NeonButton } from "@/components/ui/NeonButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CampaignsList } from "@/components/campaign/CampaignsList";
import { CampaignsListSkeleton } from "@/components/skeletons";

export default function CampaignsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Campaigns</h1>
                    <p className="text-text-muted mt-2">Track your email outreach performance.</p>
                </div>
                <Link href="/campaigns/new">
                    <NeonButton className="flex items-center gap-2">
                        <Plus size={20} fontSize={12}/>
                        Create
                    </NeonButton>
                </Link>
            </div>

            <Suspense fallback={<CampaignsListSkeleton />}>
                <CampaignsList />
            </Suspense>
        </div>
    );
}
