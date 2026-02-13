import { LoginForm } from "@/components/auth/LoginForm";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-[#1a1b26] to-[#1a1b26] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative w-full max-w-md">
                <GlassCard className="border-white/10 shadow-2xl backdrop-blur-xl">
                    <LoginForm />
                </GlassCard>
            </div>
        </div>
    );
}
