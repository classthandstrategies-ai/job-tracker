import { isWithinLastDays } from '../lib/dates';
import { Status } from '../models/application';

// A single application only stores its *current* status, not full history, so
// these metrics are defined in terms of where each application stands now.
// The definitions below are deliberately explicit — adjust them if your funnel
// semantics differ.

const TERMINAL = new Set([Status.REJECTED, Status.WITHDRAWN]);

// "Got a response" = the employer engaged beyond the initial application.
// A rejection counts as a response (they replied); a withdrawal does not (you left).
const RESPONDED = new Set([
  Status.PHONE_SCREEN,
  Status.INTERVIEW,
  Status.OFFER,
  Status.REJECTED,
]);

// "Reached an interview" = currently at Interview or beyond.
const INTERVIEWED = new Set([Status.INTERVIEW, Status.OFFER]);

const pct = (numerator, denominator) =>
  denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);

/**
 * Compute dashboard metrics from the full application list.
 *
 * @param {Application[]} applications
 * @returns {{
 *   total: number,
 *   active: number,
 *   responseRate: number,        // % of all applications that drew a response
 *   interviewRate: number,       // % of responded applications that reached an interview
 *   thisWeek: number,            // applications submitted in the last 7 days
 * }}
 */
export function computeStats(applications) {
  const total = applications.length;
  const active = applications.filter((a) => !TERMINAL.has(a.status)).length;
  const responded = applications.filter((a) => RESPONDED.has(a.status)).length;
  const interviewed = applications.filter((a) => INTERVIEWED.has(a.status)).length;
  const thisWeek = applications.filter((a) => isWithinLastDays(a.dateApplied, 7)).length;

  return {
    total,
    active,
    responseRate: pct(responded, total),
    // Conversion is measured against those who responded — of the people who
    // engaged, how many turned into an interview.
    interviewRate: pct(interviewed, responded),
    thisWeek,
  };
}
