import Image from "next/image";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
    return (
        <div className="min-h-screen w-full bg-[#1a1b26] flex items-center justify-center p-4">
            <div className="w-full max-w-[1200px] bg-[#1f2937]/50 backdrop-blur-xl rounded-[30px] border border-white/5 shadow-2xl overflow-hidden flex min-h-[800px]">
                {/* Left Side - Illustration */}
                <div className="hidden lg:block w-1/2 relative bg-purple-900/20 p-4">
                    <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                        <Image
                            src="/images/login-bg.png"
                            alt="Signup Illustration"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent" />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-[#1e1e2e]">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}
