import { relativeDayLabel } from '../lib/dates';

/**
 * Coral callout banner surfacing applications whose follow-up date has passed
 * (or is today). Each is a chip that opens its detail modal. Renders nothing
 * when there's nothing due.
 */
export default function FollowUpBanner({ dueFollowUps, onOpen }) {
  if (dueFollowUps.length === 0) return null;

  const count = dueFollowUps.length;

  return (
    <div className="animate-stagger-up rounded-lg bg-primary p-6 text-on-primary shadow-[0_10px_30px_-12px_rgba(204,120,92,0.6)]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <p className="font-display text-[22px] leading-none">
          {count} follow-up{count === 1 ? '' : 's'} due
        </p>
        <span className="text-[14px] text-on-primary/80">
          — time to check back in.
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {dueFollowUps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpen(app)}
            className="group flex items-center gap-2 rounded-md bg-canvas/15 px-3 py-1.5 text-[13px] font-medium backdrop-blur-sm transition-colors hover:bg-canvas/25"
          >
            <span className="font-semibold">{app.company}</span>
            <span className="text-on-primary/70">·</span>
            <span className="text-on-primary/80">{app.role}</span>
            <span className="rounded-full bg-canvas/20 px-1.5 py-0.5 text-[11px]">
              {relativeDayLabel(app.nextFollowUp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
