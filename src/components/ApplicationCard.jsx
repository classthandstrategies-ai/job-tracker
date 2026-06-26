import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_META } from '../models/application';
import { daysSince, relativeDayLabel } from '../lib/dates';

/**
 * A draggable application card. The drag gesture lives on a dedicated grip
 * HANDLE (so both mouse and keyboard drag work via @dnd-kit), while the card
 * BODY is a button that opens the detail modal on click / Enter / Space. Keeping
 * the two gestures on separate elements is what makes the card keyboard-operable
 * — otherwise the KeyboardSensor would hijack Enter/Space for dragging and there
 * would be no keyboard path to open the card.
 *
 * The live drag visual is cloned into a DragOverlay by the board, so the source
 * just dims while dragging (`overlay` renders the static, non-interactive clone).
 */
export default function ApplicationCard({ application, onOpen, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { status: application.status },
  });

  const accent = STATUS_META[application.status]?.accent ?? 'applied';
  const since = daysSince(application.dateApplied);
  const followUpDue = (() => {
    const d = daysSince(application.nextFollowUp);
    return d !== null && d >= 0;
  })();

  const open = () => !overlay && onOpen(application);
  const onKeyDown = (e) => {
    // Only when the card body itself is focused (not the grip handle child).
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={[
        'relative rounded-lg border border-hairline bg-canvas transition-shadow',
        overlay
          ? 'rotate-2 scale-[1.02] shadow-[0_18px_40px_-12px_rgba(20,20,19,0.4)]'
          : 'hover:shadow-[0_4px_14px_-6px_rgba(20,20,19,0.18)]',
        isDragging && !overlay ? 'opacity-40' : '',
      ].join(' ')}
    >
      {/* Card body — opens the detail modal; keyboard-operable as a button. */}
      <div
        role={overlay ? undefined : 'button'}
        tabIndex={overlay ? undefined : 0}
        aria-label={overlay ? undefined : `Open ${application.role} at ${application.company}`}
        onClick={open}
        onKeyDown={overlay ? undefined : onKeyDown}
        className={`${overlay ? '' : 'cursor-pointer'} rounded-lg p-4 pr-9 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
            <span className={`h-2 w-2 rounded-full bg-st-${accent}`} aria-hidden="true" />
            {STATUS_META[application.status]?.label}
          </span>
          {since !== null ? (
            <span className="rounded-full bg-surface-cream-strong px-2 py-0.5 text-[11px] font-medium text-muted">
              {since}d
            </span>
          ) : null}
        </div>

        <h3 className="text-[15px] font-semibold leading-snug text-ink">{application.role}</h3>
        <p className="text-[14px] text-muted">{application.company}</p>

        <div className="mt-3 flex items-center justify-between text-[12px] text-muted-soft">
          <span>Applied {application.dateApplied}</span>
          {followUpDue ? (
            <span className="flex items-center gap-1 font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Follow up {relativeDayLabel(application.nextFollowUp)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Drag handle — carries the dnd-kit activator (mouse + keyboard drag). */}
      {overlay ? (
        <span className="absolute right-2 top-2 text-muted-soft" aria-hidden="true">
          <GripIcon />
        </span>
      ) : (
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Drag ${application.role} at ${application.company} to another column`}
          className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-grab touch-none items-center justify-center rounded-md text-muted-soft hover:bg-surface-card hover:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:cursor-grabbing"
        >
          <GripIcon />
        </button>
      )}
    </article>
  );
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}
