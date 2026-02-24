import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 right-[-10%] h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[10%] h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-[160px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-8 space-y-6">
          <div className="glass-panel p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="mt-3 text-slate-400">
              This Privacy Policy explains how Outrexo collects, uses, and protects your information.
            </p>
          </div>

          <section className="glass-panel p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Data Usage</h2>
                <p className="text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Outrexo uses the Google Gmail API to send emails on the user&apos;s behalf.</span>
                  We only access the minimum data required to generate and deliver outreach messages.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Storage</h2>
                <p className="text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">We do not store or share your email content or contacts with third parties.</span>
                  Any temporary processing required to generate drafts is limited to your active session.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Revocation</h2>
                <p className="text-slate-300 leading-relaxed">
                  You can revoke Outrexo&apos;s access at any time via your Google Security settings. Once access is revoked,
                  Outrexo can no longer send emails from your account.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 md:p-8">
            <h2 className="text-xl font-semibold">Questions</h2>
            <p className="text-slate-400 leading-relaxed">
              If you have questions about this policy, contact the Outrexo team through the app or the project repository.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
