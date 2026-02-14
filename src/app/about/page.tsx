
import React from 'react';
import { Github, Linkedin, ExternalLink, Code, Cpu, ShieldCheck, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
                {/* Header Section */}
                <div className="mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-4 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Open Source Contributor
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400/50">
                        Meet the Developer
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        I'm <span className="text-indigo-400 font-semibold">Shriram Narkhede</span>, a final-year engineering student building <span className="text-white">Outrexo</span> to bridge the gap between AI and personalized outreach.
                    </p>
                </div>

                {/* Builder & Tech Stack Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-24">
                    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Code size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/20">
                                <Cpu size={24} />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">AI-Powered Engine</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Leveraging the power of <span className="text-white font-medium">DeepSeek R1</span> to analyze profiles and generate hyper-personalized recruitment emails that get responses, not just opens.
                            </p>
                        </div>
                    </div>

                    <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">Secure by Design</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Built with privacy in mind using <span className="text-white font-medium">Auth.js & Google OAuth</span>. Your data is encrypted, and we only request the permissions absolutely necessary for automation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Connect Section */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold mb-10 text-center">Let's Connect</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <a
                            href="https://www.linkedin.com/in/shriramnarkhede/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-[#0077b5]/10 hover:border-[#0077b5]/50 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="p-4 rounded-full bg-white/5 mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                                <Linkedin size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-1">LinkedIn</h3>
                            <p className="text-sm text-slate-400 mb-4">Professional Network</p>
                            <span className="text-sm text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                                Connect <ExternalLink size={14} />
                            </span>
                        </a>

                        <a
                            href="https://github.com/ShriramNarkhede"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-[#24292e]/20 hover:border-white/30 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="p-4 rounded-full bg-white/5 mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                                <Github size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-1">GitHub</h3>
                            <p className="text-sm text-slate-400 mb-4">Open Source Contributions</p>
                            <span className="text-sm text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                                Follow <ExternalLink size={14} />
                            </span>
                        </a>

                        <a
                            href="https://iamshriram.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-violet-500/10 hover:border-violet-500/50 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="p-4 rounded-full bg-white/5 mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                                <Globe size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Portfolio</h3>
                            <p className="text-sm text-slate-400 mb-4">My Personal Website</p>
                            <span className="text-sm text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                                Visit <ExternalLink size={14} />
                            </span>
                        </a>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-md">
                    <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Outreach?</h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        Outrexo is live and open source. Dive into the code or start using the app today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://github.com/ShriramNarkhede/Outrexo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Github size={20} /> Star on GitHub
                        </a>
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-2"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
