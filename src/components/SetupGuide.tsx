import React from "react";
import {
    ShieldCheck,
    Key,
    AlertTriangle,
    Lock,
    ExternalLink,
    Info
} from "lucide-react";
import Link from "next/link";

type SetupGuideProps = {
    fullPage?: boolean;
    showBackLink?: boolean;
};

export function SetupGuide({ fullPage = true, showBackLink = true }: SetupGuideProps) {
    const wrapperClass = fullPage
        ? "min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30"
        : "bg-slate-950 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden selection:bg-indigo-500/30";
    const backgroundClass = fullPage ? "fixed" : "absolute";

    return (
        <div className={wrapperClass}>
            {/* Background Gradients */}
            <div className={`${backgroundClass} inset-0 z-0 overflow-hidden pointer-events-none`}>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 backdrop-blur-md">
                        <ShieldCheck size={16} />
                        <span className="text-sm font-semibold">Security First Protocol</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400/50">
                        Connect Your Gmail Securely
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Follow this guide to generate a unique{" "}
                        <span className="text-white font-medium">App Password</span>. This ensures
                        Outrexo never sees your real Google account password.
                    </p>
                </div>

                {/* Essential Disclaimer */}
                <div className="mb-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-6 flex flex-col md:flex-row gap-6 items-start backdrop-blur-md">
                    <div className="bg-amber-500/20 p-3 rounded-full shrink-0 text-amber-500">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-amber-400 mb-2">
                            Important: This is NOT your real password
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            An App Password is a randomly generated 16-character code that gives
                            Outrexo permission to send emails on your behalf{" "}
                            <span className="underline decoration-amber-500/50">without</span>{" "}
                            granting full access to your Google Account. Even if someone gets this
                            code, they cannot change your settings or lock you out.
                        </p>
                    </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-8 mb-20">
                    {/* Step 1 */}
                    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                        <div className="absolute top-8 right-8 text-slate-700 group-hover:text-slate-600 transition-colors pointer-events-none font-bold text-6xl opacity-20">
                            01
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <div className="bg-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/30">
                                1
                            </div>
                            Enable 2-Step Verification
                        </h3>
                        <p className="text-slate-400 mb-6 pl-11">
                            Google requires 2-Step Verification to be turned on before you can
                            create App Passwords. If you already have this, skip to Step 2.
                        </p>
                        <div className="pl-11">
                            <a
                                href="https://myaccount.google.com/security"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                Go to Google Security Settings <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                        <div className="absolute top-8 right-8 text-slate-700 group-hover:text-slate-600 transition-colors pointer-events-none font-bold text-6xl opacity-20">
                            02
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <div className="bg-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/30">
                                2
                            </div>
                            Generate App Password
                        </h3>
                        <div className="pl-11 space-y-4 text-slate-300">
                            <p>In the Google Security settings:</p>
                            <ul className="list-disc list-outside space-y-2 ml-4 marker:text-indigo-500">
                                <li>
                                    Search for <strong>"App Passwords"</strong> in the search bar
                                    at the top{" "}
                                    <span className="text-slate-500">
                                        (or scroll to the "Signing in to Google" section)
                                    </span>
                                    .
                                </li>
                                <li>You may be asked to sign in again.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                        <div className="absolute top-8 right-8 text-slate-700 group-hover:text-slate-600 transition-colors pointer-events-none font-bold text-6xl opacity-20">
                            03
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <div className="bg-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/30">
                                3
                            </div>
                            Name Your App
                        </h3>
                        <div className="pl-11 space-y-4 text-slate-300">
                            <p>Google will ask for an app name:</p>
                            <ul className="list-disc list-outside space-y-2 ml-4 marker:text-indigo-500">
                                <li>
                                    Enter <strong className="text-white">Outrexo</strong> as the app
                                    name.
                                </li>
                                <li>
                                    Click <strong>Create</strong>.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                        <div className="absolute top-8 right-8 text-slate-700 group-hover:text-slate-600 transition-colors pointer-events-none font-bold text-6xl opacity-20">
                            04
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <div className="bg-indigo-600 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/30">
                                4
                            </div>
                            Copy & Paste Code
                        </h3>
                        <div className="pl-11 space-y-6 text-slate-300">
                            <p>
                                A 16-character code will appear in a yellow bar (e.g.,{" "}
                                <code className="bg-slate-800 px-2 py-1 rounded text-indigo-300 font-mono">
                                    xxxx xxxx xxxx xxxx
                                </code>
                                ).
                            </p>
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center gap-4">
                                <Key className="text-indigo-400" size={32} />
                                <p className="text-center text-sm text-slate-400">
                                    Copy this code (spaces don't matter) and paste it into the{" "}
                                    <br />{" "}
                                    <strong className="text-white">Google App Password</strong>{" "}
                                    field in Outrexo settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pro Tip Alert */}
                <div className="mb-24 rounded-2xl bg-indigo-900/20 border border-indigo-500/30 p-6 flex items-start gap-4 backdrop-blur-md">
                    <Info className="text-indigo-400 shrink-0 mt-1" size={24} />
                    <div>
                        <h4 className="text-lg font-bold text-indigo-300 mb-2">
                            Pro Tip: Changing Passwords
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            If you ever change your main Google Account password, all App
                            Passwords are automatically revoked for your safety. You will need to
                            generate a new one for Outrexo if that happens.
                        </p>
                    </div>
                </div>

                {/* Security Benefits */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Why is this safe?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Limited Access</h3>
                            <p className="text-slate-400 text-sm">
                                This password only grants access to mail protocols (SMTP), not
                                your Google Drive, Photos, or Admin settings.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Revocable Anytime</h3>
                            <p className="text-slate-400 text-sm">
                                You can delete this App Password instantly from your Google
                                Account settings if you want to cut off access.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                                <Key size={20} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Encrypted Storage</h3>
                            <p className="text-slate-400 text-sm">
                                Outrexo stores your App Password using industry-standard
                                encryption. We never see or store your real Google password.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                {showBackLink ? (
                    <div className="flex justify-center mb-24">
                        <Link
                            href="/settings"
                            className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/5"
                        >
                            Back to Settings
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
