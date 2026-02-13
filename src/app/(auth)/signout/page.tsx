"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function SignoutPage() {
    return (
        <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-[#1a1b26] to-[#1a1b26] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative w-full max-w-md">
                <GlassCard className="border-white/10 shadow-2xl backdrop-blur-xl p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <LogOut className="w-8 h-8 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white">Sign out</h1>
                        <p className="text-gray-400">Are you sure you want to sign out of your account?</p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20"
                        >
                            Yes, sign me out
                        </button>
                        <Link
                            href="/"
                            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
