import { useMemo, useState } from 'react';
import { useApplications } from './hooks/useApplications';
import { getDueFollowUps } from './selectors/followUps';
import { downloadCSV } from './lib/csv';
import { makeSampleApplications } from './lib/sampleData';
import DashboardHeader from './components/DashboardHeader';
import FollowUpBanner from './components/FollowUpBanner';
import Toolbar from './components/Toolbar';
import KanbanBoard from './components/KanbanBoard';
import ApplicationFormModal from './components/ApplicationFormModal';

function App() {
  const {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    replaceAll,
    storageError,
  } = useApplications();

  const [query, setQuery] = useState('');
  // modal: null | { mode: 'add' } | { mode: 'edit', id }
  const [modal, setModal] = useState(null);

  // Search filters the BOARD; stats and CSV export always use the full list.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (a) =>
        a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q),
    );
  }, [applications, query]);

  const dueFollowUps = useMemo(() => getDueFollowUps(applications), [applications]);

  const editing =
    modal?.mode === 'edit' ? applications.find((a) => a.id === modal.id) ?? null : null;

  const openEdit = (app) => setModal({ mode: 'edit', id: app.id });

  const handleSubmit = (values) => {
    if (modal?.mode === 'edit') {
      updateApplication(modal.id, values);
    } else {
      addApplication(values);
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (modal?.mode === 'edit') removeApplication(modal.id);
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <DashboardHeader applications={applications} />

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {storageError ? (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-[14px] text-error"
          >
            <strong className="font-semibold">Changes aren't being saved.</strong> Your
            browser blocked local storage (it may be full or in private mode). Export a CSV
            backup to avoid losing data on reload.
          </div>
        ) : null}

        {dueFollowUps.length > 0 ? (
          <div className="mb-8">
            <FollowUpBanner dueFollowUps={dueFollowUps} onOpen={openEdit} />
          </div>
        ) : null}

        <div className="mb-6">
          <Toolbar
            query={query}
            onQuery={setQuery}
            onAdd={() => setModal({ mode: 'add' })}
            onExport={() => downloadCSV(applications)}
            matchCount={filtered.length}
            totalCount={applications.length}
          />
        </div>

        {applications.length === 0 ? (
          <EmptyState
            onAdd={() => setModal({ mode: 'add' })}
            onSeed={() => replaceAll(makeSampleApplications())}
          />
        ) : (
          <KanbanBoard
            applications={filtered}
            onChangeStatus={(id, status) => updateApplication(id, { status })}
            onOpenCard={openEdit}
          />
        )}
      </main>

      {modal?.mode === 'add' ? (
        <ApplicationFormModal mode="add" onSubmit={handleSubmit} onClose={() => setModal(null)} />
      ) : null}

      {modal?.mode === 'edit' && editing ? (
        <ApplicationFormModal
          key={editing.id}
          mode="edit"
          application={editing}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      ) : null}
    </div>
  );
}

/** First-run empty state — offers a blank start or demo data. */
function EmptyState({ onAdd, onSeed }) {
  return (
    <div className="rounded-xl border border-dashed border-hairline bg-surface-soft/60 px-6 py-20 text-center">
      <p className="mx-auto mb-2 flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[1.5px] text-muted">
        <span className="spike-mark text-primary" /> Empty pipeline
      </p>
      <h2 className="font-display text-[36px] leading-tight text-ink">
        Track your first application
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
        Add a job you've applied to, then drag it across the board as you move
        through screens, interviews, and offers.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="rounded-md bg-primary px-5 py-2.5 text-[14px] font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          Add application
        </button>
        <button
          type="button"
          onClick={onSeed}
          className="rounded-md border border-hairline bg-canvas px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface-card"
        >
          Load sample data
        </button>
      </div>
    </div>
  );
}

export default App;
