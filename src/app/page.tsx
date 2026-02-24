import Image from "next/image";
import Link from "next/link";
import { Bot, ShieldCheck, UploadCloud, Sparkles, Mail } from "lucide-react";

const features = [
  {
    title: "AI Templates",
    description:
      "Personalized body generation using DeepSeek R1 for role-specific outreach.",
    icon: Bot,
  },
  {
    title: "Secure Auth",
    description: "OAuth 2.0 integration with Google. No passwords stored.",
    icon: ShieldCheck,
  },
  {
    title: "Bulk Import",
    description: "Upload CSV or Excel to queue candidates in seconds.",
    icon: UploadCloud,
  },
];

const steps = [
  {
    title: "Connect Gmail",
    description: "Authorize once with Google OAuth to enable sending.",
    icon: Mail,
  },
  {
    title: "Upload Candidates",
    description: "Import lists with roles, skills, and notes.",
    icon: UploadCloud,
  },
  {
    title: "Generate & Send",
    description: "DeepSeek R1 crafts tailored messages at scale.",
    icon: Sparkles,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[420px] w-[420px] rounded-full bg-violet-500/15 blur-[160px]" />
      </div>

      <header className="relative z-10">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-inner">
              <Image
                src="/images/Outrexo1.png"
                alt="Outrexo"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                priority
              />
            </span>
            Outrexo
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
          <Link
            href="/login"
            className="rounded-xl bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/40 hover:bg-indigo-500/30 transition"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-12 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-indigo-200 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                Built for modern recruiting teams
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                AI-Powered Email Outreach for Modern Recruiters.
              </h1>
              <p className="text-lg text-slate-300 md:text-xl">
                Automate personalized recruitment emails with DeepSeek R1 and secure Gmail integration.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="btn-neon flex items-center justify-center gap-2"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  View Features
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">OAuth 2.0</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Gmail API</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">DeepSeek R1</span>
              </div>
            </div>
            <div className="glass-panel p-6 md:p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Campaign Overview</p>
                    <p className="text-xl font-semibold">Recruiting Pipeline</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    Live
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Personalized drafts</span>
                    <span className="text-white">128</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 w-[75%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Scheduled sends</span>
                    <span className="text-white">92</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 w-[60%] rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">AI Suggestions</p>
                      <p className="text-slate-400">
                        Tone matched to candidate seniority and skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-indigo-300">Features</p>
              <h2 className="text-3xl font-semibold">Everything you need to scale outreach</h2>
            </div>
            <Link
              href="/about"
              className="hidden text-sm font-semibold text-indigo-300 hover:text-indigo-200 md:inline"
            >
              Learn more
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-widest text-indigo-300">Workflow</p>
              <h2 className="text-3xl font-semibold">From list to inbox in minutes</h2>
              <p className="text-slate-400 leading-relaxed">
                Outrexo connects to Gmail, structures candidate data, and generates polished outreach using DeepSeek R1. You stay in control of every send.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Google OAuth Verification Ready</p>
                <p className="text-slate-400">
                  The platform uses the Gmail API strictly to send recruitment emails on your behalf.
                </p>
              </div>
            </div>
            <div className="glass-panel p-6">
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-indigo-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-indigo-200">Step {index + 1}</p>
                        <p className="text-base font-semibold text-white">{step.title}</p>
                        <p className="text-sm text-slate-400">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="glass-panel flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-indigo-300">Get started</p>
              <h2 className="text-3xl font-semibold">Launch your next recruiting campaign faster</h2>
              <p className="text-slate-400">
                Deliver personalized outreach without sacrificing compliance or control.
              </p>
            </div>
            <Link
              href="/login"
              className="btn-neon"
            >
              Login to Outrexo
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Outrexo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
