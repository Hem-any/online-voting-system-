import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/50 bg-white/85 px-6 py-6 text-sm text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">© 2026 VoteSecure. Digital election workspace.</p>
        <p className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
          Secure access, auditable ballots, transparent results
        </p>
      </div>
    </footer>
  );
}
