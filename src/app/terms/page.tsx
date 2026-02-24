import Link from "next/link";
import { FileText, AlertTriangle, ArrowLeft } from "lucide-react";

const rules = [
  "Users are responsible for the content of emails sent.",
  "Outrexo is provided as-is during its beta/portfolio phase.",
  "Misuse of the Gmail API is prohibited.",
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[-10%] h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[10%] h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-[160px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-8 space-y-6">
          <div className="glass-panel p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="mt-3 text-slate-400">
              By using Outrexo, you agree to the following terms and conditions.
            </p>
          </div>

          <section className="glass-panel p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Usage Rules</h2>
                <ul className="mt-3 space-y-3 text-slate-300">
                  {rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-500/20 p-2 text-amber-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Compliance</h2>
                <p className="text-slate-300 leading-relaxed">
                  You agree to comply with Google&apos;s API policies and applicable email regulations. Any abusive or
                  unauthorized activity may result in suspension of access.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 md:p-8">
            <h2 className="text-xl font-semibold">Changes</h2>
            <p className="text-slate-400 leading-relaxed">
              These terms may be updated periodically to reflect product changes. Continued use of Outrexo indicates
              acceptance of the latest terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
