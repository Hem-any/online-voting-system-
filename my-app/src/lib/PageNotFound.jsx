import { Link } from "react-router-dom";
import ThemedPageShell from "../components/common/ThemedPageShell";

export default function PageNotFound() {
  return (
    <ThemedPageShell>
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="mb-2 text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
        <h2 className="mb-4 text-xl font-bold text-slate-700 dark:text-slate-300">Page Not Found</h2>
        <p className="mb-6 max-w-sm text-center text-slate-500 dark:text-slate-400">
          The destination you are trying to reach does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700"
        >
          Go Back Home
        </Link>
      </div>
    </ThemedPageShell>
  );
}
