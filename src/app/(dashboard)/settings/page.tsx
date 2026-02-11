import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { User, Mail, ShieldCheck, Globe, Calendar } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SmtpForm } from "@/components/SmtpForm";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const account = await prisma.account.findFirst({
        where: { userId: session.user.id, provider: "google" }
    });

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-text-muted mt-2">Manage your account and connections.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                {/* Profile Card */}
               <GlassPanel className="w-fit mx-auto center flex flex-col items-center text-center py-4">

                    <div className="relative w-24 h-24 mb-6">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                fill
                                sizes="96px"
                                className="rounded-full border-4 border-primary/20 shadow-xl"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User size={40} />
                            </div>
                        )}
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    <h2 className="text-xl font-bold">{session.user.name}</h2>
                    <p className="text-text-muted text-sm mt-1">{session.user.email}</p>

                     <GlassPanel className="space-y-4 mt-10">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Calendar className="text-secondary" size={20} />
                            Account Details
                        </h3>
                        <div className="grid grid-rows-2 gap-4 w-full text-left self-start">

                            <div>
                                <p className="text-xs text-text-muted uppercase font-bold tracking-wider">User ID</p>
                                <p className="text-sm font-mono mt-1 truncate">{session.user.id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Plan</p>
                                <p className="text-sm mt-1">Free Tier</p>
                            </div>
                        </div>
                    </GlassPanel>
                </GlassPanel>

                {/* Connection Status */}
                <div className="md:col-span-2 space-y-6">
                    <GlassPanel className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="text-primary" size={20} />
                                Infrastructure & Security
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${account ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {account ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded text-blue-400">
                                        <Globe size={18} />
                                    </div>
                                    <div>
                                        <p className="font-medium">Google OAuth 2.0</p>
                                        <p className="text-xs text-text-muted">Required for sending emails via Gmail API</p>
                                    </div>
                                </div>
                                <ShieldCheck size={20} className={account ? "text-green-500" : "text-text-muted"} />
                            </div>

                            {/* SMTP Configuration */}
                            <div className="p-4 bg-white/5 rounded-lg border border-border space-y-4">
                                <SmtpForm />
                            </div>
                        </div>
                    </GlassPanel>

                   
                </div>
            </div >
        </div >
    );
}
