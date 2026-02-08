"use client";

import { useState } from "react";
import { googleSignIn } from "@/app/actions/auth-actions";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Create an account</h1>
                <p className="text-gray-400">
                    Already have an account?{" "}
                    <button onClick={() => googleSignIn()} className="text-gray-300 underline hover:text-white transition-colors">
                        Log in
                    </button>
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                </div>

                <div className="space-y-2 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                        terms & conditions
                    </a>
                </label>
            </div>

            <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-purple-500/20">
                Create account
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#1a1b26] text-gray-500">Or register with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => googleSignIn()}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.77.74 3.52 1.83-3.14 1.88-2.58 6.44.47 7.71-.34.82-.77 1.66-1.31 2.45-.75 1.07-1.57 2.14-2.54 2.14h-.01c-.01.01-.01.01-1.27-.08h.55zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                </button>
            </div>
        </div>
    );
}
