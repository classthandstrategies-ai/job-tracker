// Date helpers. All app dates are ISO "YYYY-MM-DD" strings (date-only, no time),
// so comparisons happen on day boundaries in the user's local timezone.

/**
 * Format a Date as a local "YYYY-MM-DD" string. Uses local calendar components
 * — NOT toISOString(), which converts to UTC and can roll the date back/forward
 * a day near midnight in non-UTC timezones.
 */
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Today as a local ISO date string ("YYYY-MM-DD"). */
export function todayISO() {
  return toISODate(new Date());
}

/** Parse an ISO date-only string into a local Date at midnight. Returns null if blank/invalid. */
export function parseISODate(iso) {
  if (!iso || typeof iso !== 'string') return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Today at local midnight. */
export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole days between an ISO date and today (today = 0, yesterday = 1). Null if unparseable. */
export function daysSince(iso) {
  const date = parseISODate(iso);
  if (!date) return null;
  const diffMs = startOfToday() - date;
  return Math.floor(diffMs / 86_400_000);
}

/** True if the ISO date is strictly before today (i.e. a follow-up is overdue). */
export function isPast(iso) {
  const date = parseISODate(iso);
  if (!date) return false;
  return date < startOfToday();
}

/** True if the ISO date falls within the last `days` days (inclusive of today). */
export function isWithinLastDays(iso, days) {
  const since = daysSince(iso);
  return since !== null && since >= 0 && since < days;
}

/** Human-friendly "3 days ago" / "today" / "in 2 days" relative label. */
export function relativeDayLabel(iso) {
  const since = daysSince(iso);
  if (since === null) return '';
  if (since === 0) return 'today';
  if (since === 1) return 'yesterday';
  if (since > 1) return `${since} days ago`;
  const ahead = -since;
  return ahead === 1 ? 'tomorrow' : `in ${ahead} days`;
}
