import { LoaderCircle, Send } from "lucide-react";

export default function VoteButton({
  onClick,
  disabled,
  loading,
  children = "Cast secure vote",
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!onClick || disabled || loading) return;
        onClick();
      }}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-bold text-white shadow-lg shadow-slate-950/10 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto"
    >
      {loading ? (
        <LoaderCircle className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
      )}
      {children}
    </button>
  );
}
