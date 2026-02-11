import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { NeonButton } from "@/components/ui/NeonButton";
import { Plus, Edit2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteTemplateButton } from "@/components/templates/DeleteTemplateButton";

export default async function TemplatesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const templates = await prisma.template.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Email Templates</h1>
                    <p className="text-text-muted mt-2">Manage your outreach scripts and variables.</p>
                </div>
                <Link href="/templates/new">
                    <NeonButton className="flex items-center gap-2">
                        <Plus size={20} />
                        Create Template
                    </NeonButton>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.length === 0 ? (
                    <GlassPanel className="col-span-full py-20 text-center">
                        <p className="text-text-muted text-lg mb-6">You haven't created any templates yet.</p>
                        <Link href="/templates/new">
                            <NeonButton variant="secondary">Get Started</NeonButton>
                        </Link>
                    </GlassPanel>
                ) : (
                    templates.map((template) => (
                        <GlassPanel key={template.id} className="flex flex-col h-full group hover:border-primary/30 transition-colors">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 truncate" title={template.name}>{template.name}</h3>
                                <p className="text-sm text-text-muted mb-4 truncate">Subject: {template.subject}</p>
                                <div className="text-sm text-text-muted line-clamp-3 bg-black/20 p-3 rounded-md font-mono text-xs">
                                    {template.body.replace(/<[^>]*>?/gm, "")}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                                <Link href={`/templates/${template.id}`} className="flex-1">
                                    <button className="w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-white/5 transition-colors text-sm font-medium">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                </Link>
                                
                            </div>
                        </GlassPanel>
                    ))
                )}
            </div>
        </div>
    );
}
