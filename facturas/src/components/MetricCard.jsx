export default function MetricCard({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  highlight = false,
}) {
  const getBadgeClasses = () => {
    switch (badgeType) {
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'danger':
        return 'bg-rose-50 text-rose-800 border-rose-200/80';
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'info':
        return 'bg-sky-50 text-sky-800 border-sky-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div
      id={id}
      className={`relative rounded-xl border p-5 transition-all bg-white card-hover-transition ${
        highlight
          ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-2xs'
          : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-slate-950 font-mono tabular-nums">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60 shadow-2xs">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
        <span className="text-xs text-slate-500 truncate">{subtitle}</span>
        {badgeText && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getBadgeClasses()}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

