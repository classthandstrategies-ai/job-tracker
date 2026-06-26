import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_META } from '../models/application';
import { daysSince, relativeDayLabel } from '../lib/dates';

/**
 * A draggable application card. Renders inside a column; the actual drag visual
 * is cloned into a DragOverlay by the board, so here we just dim the source
 * while it's being dragged. A plain click (no drag movement) opens the detail
 * modal — the board's distance activation constraint keeps the two gestures apart.
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

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      onClick={() => !overlay && onOpen(application)}
      className={[
        'group cursor-grab touch-none rounded-lg border border-hairline bg-canvas p-4 text-left',
        'transition-shadow active:cursor-grabbing',
        overlay
          ? 'rotate-2 scale-[1.02] cursor-grabbing shadow-[0_18px_40px_-12px_rgba(20,20,19,0.4)]'
          : 'hover:shadow-[0_4px_14px_-6px_rgba(20,20,19,0.18)]',
        isDragging && !overlay ? 'opacity-40' : '',
      ].join(' ')}
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
    </article>
  );
}
