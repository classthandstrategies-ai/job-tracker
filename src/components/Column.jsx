import { useDroppable } from '@dnd-kit/core';
import ApplicationCard from './ApplicationCard';
import { STATUS_META } from '../models/application';

/**
 * A single pipeline column = one status. Acts as a dnd-kit drop target keyed by
 * the status string, so dropping a card here sets that card's status.
 */
export default function Column({ status, applications, onOpenCard }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = STATUS_META[status];

  return (
    <section
      className="flex w-72 shrink-0 flex-col rounded-xl bg-surface-card/70 sm:w-[19rem]"
    >
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-body-strong uppercase">
          <span className={`h-2.5 w-2.5 rounded-full bg-st-${meta.accent}`} aria-hidden="true" />
          {meta.label}
        </h2>
        <span className="rounded-full bg-canvas px-2 py-0.5 text-[12px] font-medium text-muted">
          {applications.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={[
          'scroll-cream flex min-h-32 flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3',
          'rounded-b-xl transition-colors',
          isOver ? 'bg-primary/8 ring-2 ring-inset ring-primary/30' : '',
        ].join(' ')}
      >
        {applications.length === 0 ? (
          <p className="mt-2 rounded-lg border border-dashed border-hairline px-3 py-6 text-center text-[12px] text-muted-soft">
            {isOver ? 'Drop here' : 'No applications'}
          </p>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} onOpen={onOpenCard} />
          ))
        )}
      </div>
    </section>
  );
}
