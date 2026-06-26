import { useState } from 'react';
import Modal from './Modal';
import { STATUS_VALUES, todayISO } from '../models/application';
import { daysSince } from '../lib/dates';

const FIELD_LABEL = 'mb-1.5 block text-[13px] font-medium text-muted';
const FIELD_INPUT =
  'w-full rounded-md border border-hairline bg-canvas px-3.5 py-2.5 text-[15px] text-ink ' +
  'placeholder:text-muted-soft transition-shadow focus:border-primary focus:outline-none ' +
  'focus:ring-[3px] focus:ring-primary/15';

const EMPTY = {
  company: '',
  role: '',
  status: STATUS_VALUES[0],
  dateApplied: todayISO(),
  salary: '',
  link: '',
  nextFollowUp: '',
  notes: '',
};

/**
 * Add / edit / detail modal. In "add" mode it starts blank; in "edit" mode it
 * is pre-filled from `application` and exposes a Delete action. Company and role
 * are required; everything else is optional.
 */
export default function ApplicationFormModal({
  mode = 'add',
  application = null,
  onSubmit,
  onDelete,
  onClose,
}) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(application ?? {}) }));
  const [touched, setTouched] = useState(false);

  const isEdit = mode === 'edit';
  const valid = form.company.trim() && form.role.trim();
  // Errors only surface after a submit attempt (touched), keeping the form quiet
  // on first open while still announcing problems to assistive tech on submit.
  const companyError = touched && !form.company.trim();
  const roleError = touched && !form.role.trim();
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
    });
  };

  const appliedAgo = isEdit ? daysSince(form.dateApplied) : null;

  return (
    <Modal
      title={isEdit ? 'Application details' : 'Add application'}
      onClose={onClose}
      footer={
        <>
          {isEdit && onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="mr-auto rounded-md px-3 py-2 text-[14px] font-medium text-error transition-colors hover:bg-error/10"
            >
              Delete
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-hairline bg-canvas px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-surface-card"
          >
            Cancel
          </button>
          {/* Intentionally NOT disabled: a disabled submit makes the validation
              error path unreachable for keyboard/AT users. We validate on submit
              (setTouched) and surface role="alert" errors instead. */}
          <button
            type="submit"
            form="application-form"
            aria-disabled={!valid}
            className="rounded-md bg-primary px-4 py-2 text-[14px] font-medium text-on-primary transition-colors hover:bg-primary-active aria-disabled:bg-primary-disabled aria-disabled:text-muted-soft"
          >
            {isEdit ? 'Save changes' : 'Add application'}
          </button>
        </>
      }
    >
      <form id="application-form" onSubmit={submit} className="space-y-4">
        {isEdit && appliedAgo !== null ? (
          <p className="-mt-1 text-[13px] text-muted-soft">
            Applied{' '}
            {appliedAgo === 0
              ? 'today'
              : `${appliedAgo} day${appliedAgo === 1 ? '' : 's'} ago`}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="app-company" className={FIELD_LABEL}>
              Company *
            </label>
            <input
              id="app-company"
              className={FIELD_INPUT}
              value={form.company}
              onChange={set('company')}
              placeholder="Acme Inc."
              aria-invalid={companyError}
              aria-describedby={companyError ? 'app-company-error' : undefined}
            />
            {companyError ? (
              <p
                id="app-company-error"
                role="alert"
                className="mt-1 text-[12px] text-error"
              >
                Company is required.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="app-role" className={FIELD_LABEL}>
              Role *
            </label>
            <input
              id="app-role"
              className={FIELD_INPUT}
              value={form.role}
              onChange={set('role')}
              placeholder="Senior Engineer"
              aria-invalid={roleError}
              aria-describedby={roleError ? 'app-role-error' : undefined}
            />
            {roleError ? (
              <p id="app-role-error" role="alert" className="mt-1 text-[12px] text-error">
                Role is required.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="app-status" className={FIELD_LABEL}>
              Status
            </label>
            <select
              id="app-status"
              className={FIELD_INPUT}
              value={form.status}
              onChange={set('status')}
            >
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="app-date-applied" className={FIELD_LABEL}>
              Date applied
            </label>
            <input
              id="app-date-applied"
              type="date"
              className={FIELD_INPUT}
              value={form.dateApplied}
              max={todayISO()}
              onChange={set('dateApplied')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="app-salary" className={FIELD_LABEL}>
              Salary
            </label>
            <input
              id="app-salary"
              className={FIELD_INPUT}
              value={form.salary}
              onChange={set('salary')}
              placeholder="$140k"
            />
          </div>
          <div>
            <label htmlFor="app-next-followup" className={FIELD_LABEL}>
              Next follow-up
            </label>
            <input
              id="app-next-followup"
              type="date"
              className={FIELD_INPUT}
              value={form.nextFollowUp}
              onChange={set('nextFollowUp')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="app-link" className={FIELD_LABEL}>
            Posting link
          </label>
          <input
            id="app-link"
            className={FIELD_INPUT}
            value={form.link}
            onChange={set('link')}
            placeholder="https://…"
          />
        </div>

        <div>
          <label htmlFor="app-notes" className={FIELD_LABEL}>
            Notes
          </label>
          <textarea
            id="app-notes"
            className={`${FIELD_INPUT} min-h-24 resize-y`}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Recruiter name, referral, prep reminders…"
          />
        </div>
      </form>
    </Modal>
  );
}
