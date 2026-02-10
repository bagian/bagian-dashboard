export function TimelineItem({
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
      {/* Dot */}
      <div
        className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white ${
          active ? "bg-blue-500 animate-pulse" : "bg-zinc-900"
        }`}
      />

      {/* Phase */}
      <p
        className={`text-xs font-black uppercase tracking-widest ${
          active ? "text-blue-500" : "text-zinc-400"
        }`}
      >
        {phase}
      </p>

      {/* Title */}
      <h4 className="mt-1 text-sm font-semibold text-zinc-900">{title}</h4>

      {/* Date */}
      <p className="mt-1 text-xs text-zinc-500">{date}</p>
    </div>
  );
}
