export function StatCard({
  title,
  value,
  suffix,
  accent,
}: {
  title: string;
  value: string;
  suffix?: string;
  accent?: "orange" | "emerald";
}) {
  const accentColor =
    accent === "orange"
      ? "text-orange-500"
      : accent === "emerald"
        ? "text-emerald-500"
        : "text-zinc-900";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-zinc-400">{title}</p>
      <div className="mt-4 flex items-end gap-2">
        <span className={`text-3xl font-semibold ${accentColor}`}>{value}</span>
        {suffix && (
          <span className="text-xs font-semibold text-zinc-400 mb-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  phase,
  date,
  active,
}: {
  title: string;
  phase: string;
  date: string;
  active?: boolean;
}) {
  return (
    <div className="relative pl-8">
      <div
        className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white ${
          active ? "bg-blue-500 animate-pulse" : "bg-zinc-900"
        }`}
      />
      <p
        className={`text-xs uppercase tracking-widest font-bold ${
          active ? "text-blue-500" : "text-zinc-400"
        }`}
      >
        {phase}
      </p>
      <h4 className="mt-1 font-semibold text-zinc-900">{title}</h4>
      <p className="text-xs text-zinc-500 mt-1">{date}</p>
    </div>
  );
}
