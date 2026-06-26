import { daysSince } from '../lib/dates';
import { Status } from '../models/application';

// Statuses where chasing a follow-up no longer makes sense.
const TERMINAL = new Set([Status.REJECTED, Status.WITHDRAWN]);

/**
 * Applications whose nextFollowUp date is due — today or earlier — and that are
 * still in an active state. Terminal applications (Rejected/Withdrawn) are
 * excluded since there's nothing left to chase.
 *
 * Sorted most-overdue first so the most urgent item leads the alert banner.
 *
 * @param {Application[]} applications
 * @returns {Application[]}
 */
export function getDueFollowUps(applications) {
  // Parse each date exactly once: tag with `since`, filter, sort on the tag,
  // then unwrap — avoids re-parsing the ISO string O(n log n) times in the sort.
  return applications
    .map((app) => ({ app, since: daysSince(app.nextFollowUp) }))
    .filter(({ app, since }) => !TERMINAL.has(app.status) && since !== null && since >= 0)
    .sort((a, b) => b.since - a.since) // most overdue first
    .map(({ app }) => app);
}
