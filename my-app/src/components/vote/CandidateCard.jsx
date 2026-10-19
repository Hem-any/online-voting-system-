import { CheckCircle2, Circle, UserRound } from "lucide-react";// used for the icons in the candidate card

export default function CandidateCard({
  candidate,
  selected,
  onSelect,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (disabled || !onSelect) return;
        onSelect(candidate.id);
      }}
      disabled={disabled}
      aria-pressed={selected}
      className={`group min-h-44 w-full rounded-lg border p-5 text-left transition ${
        selected
          ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-900/10"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-emerald-300">
          <UserRound className="h-6 w-6" />
        </div>
        {selected ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        ) : (
          <Circle className="h-6 w-6 text-slate-300 transition group-hover:text-slate-500" />
        )}
      </div>

      <div className="mt-5 text-lg font-black text-slate-950">
        {candidate.name}
      </div>

      <div className="mt-1 text-sm font-semibold text-emerald-700">
        {candidate.party}
      </div>

      {candidate.bio && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {candidate.bio}
        </p>
      )}
    </button>
  );
}
