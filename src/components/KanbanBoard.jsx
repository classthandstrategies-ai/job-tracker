import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import Column from './Column';
import ApplicationCard from './ApplicationCard';
import { STATUS_VALUES } from '../models/application';

/**
 * The kanban board. Groups the (already filtered) applications into one column
 * per status and wires up drag-and-drop. Dropping a card onto a column whose id
 * differs from the card's current status calls `onChangeStatus`.
 */
export default function KanbanBoard({ applications, onChangeStatus, onOpenCard }) {
  const [activeId, setActiveId] = useState(null);

  // 6px activation distance: a click stays a click (opens the card); only a
  // deliberate drag past the threshold begins a move.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const byStatus = useMemo(() => {
    const groups = Object.fromEntries(STATUS_VALUES.map((s) => [s, []]));
    for (const app of applications) {
      (groups[app.status] ??= []).push(app);
    }
    return groups;
  }, [applications]);

  const activeApp = activeId
    ? (applications.find((a) => a.id === activeId) ?? null)
    : null;

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const targetStatus = over.id; // column ids ARE status strings
    const moved = applications.find((a) => a.id === active.id);
    if (moved && moved.status !== targetStatus) {
      onChangeStatus(active.id, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="scroll-cream flex gap-4 overflow-x-auto pb-4">
        {STATUS_VALUES.map((status) => (
          <Column
            key={status}
            status={status}
            applications={byStatus[status]}
            onOpenCard={onOpenCard}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.22,1,0.36,1)' }}
      >
        {activeApp ? (
          <div className="w-72 sm:w-[19rem]">
            <ApplicationCard application={activeApp} onOpen={() => {}} overlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
