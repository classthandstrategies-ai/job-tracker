// Data model for a single job application.
//
// Shape of an application record:
// {
//   id:           string  — stable unique id (uuid)
//   company:      string
//   role:         string
//   status:       Status  — one of the values below
//   dateApplied:  string  — ISO date "YYYY-MM-DD"
//   salary:       string  — free-form (e.g. "$120k", "₹18 LPA", "")
//   link:         string  — URL to the posting
//   notes:        string
//   nextFollowUp: string  — ISO date "YYYY-MM-DD" or "" if none
// }

/**
 * Status enum. Frozen so values can't be mutated at runtime, and the
 * insertion order doubles as the natural pipeline order for sorting/grouping.
 */
export const Status = Object.freeze({
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
});

/** Ordered list of status values — handy for dropdowns and pipeline columns. */
export const STATUS_VALUES = Object.values(Status);

/**
 * Per-status display metadata. `accent` maps to the --color-st-* theme tokens
 * (so `bg-st-${accent}` / `text-st-${accent}` resolve via Tailwind), giving
 * each kanban column and status dot a consistent, on-brand hue.
 */
export const STATUS_META = Object.freeze({
  [Status.APPLIED]: { accent: 'applied', label: 'Applied' },
  [Status.PHONE_SCREEN]: { accent: 'phone', label: 'Phone Screen' },
  [Status.INTERVIEW]: { accent: 'interview', label: 'Interview' },
  [Status.OFFER]: { accent: 'offer', label: 'Offer' },
  [Status.REJECTED]: { accent: 'rejected', label: 'Rejected' },
  [Status.WITHDRAWN]: { accent: 'withdrawn', label: 'Withdrawn' },
});

/** Default status for a brand-new application. */
export const DEFAULT_STATUS = Status.APPLIED;

/**
 * Generate a unique id. Uses the platform crypto.randomUUID when available
 * (all modern browsers) and falls back to a timestamp+random string.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Sourced from the date helpers so the whole app shares one local-time
// implementation (avoids the toISOString/UTC off-by-one near midnight).
// Imported locally because createApplication() calls it, and re-exported so
// existing `import { todayISO } from './models/application'` sites keep working.
import { todayISO } from '../lib/dates';
export { todayISO };

/**
 * Build a complete, well-formed application from partial input. Every field
 * gets a sensible default so the rest of the app never has to guard against
 * `undefined`. Callers pass only what they have; this fills in the rest.
 *
 * @param {Partial<Application>} input
 * @returns {Application}
 */
export function createApplication(input = {}) {
  // Coerce every text field to a string before use. Optional chaining alone
  // (input.company?.trim()) throws on a non-null non-string (e.g. company: 123
  // from corrupt/edited storage), which would otherwise crash hydration.
  const str = (v) => (v == null ? '' : String(v));
  return {
    id: input.id ?? generateId(),
    company: str(input.company).trim(),
    role: str(input.role).trim(),
    status: STATUS_VALUES.includes(input.status) ? input.status : DEFAULT_STATUS,
    dateApplied: str(input.dateApplied) || todayISO(),
    salary: str(input.salary),
    link: str(input.link),
    notes: str(input.notes),
    nextFollowUp: str(input.nextFollowUp),
  };
}

/**
 * Normalize an unknown value read from storage into a valid application,
 * or return null if it's not a usable object. Keeps corrupt single records
 * from poisoning the whole list.
 *
 * @param {unknown} raw
 * @returns {Application | null}
 */
export function normalizeApplication(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (!('id' in raw)) return null;
  // Isolate per-record failures: if a single malformed record can't be built,
  // drop just that one (return null) rather than letting the throw bubble up
  // and wipe the entire list during hydration.
  try {
    return createApplication(raw);
  } catch {
    return null;
  }
}
