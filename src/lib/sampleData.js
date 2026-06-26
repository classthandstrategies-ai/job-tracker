import { createApplication, Status } from '../models/application';
import { toISODate } from './dates';

/** Local ISO date `n` days before today (negative n = future). */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

/**
 * A spread of demo applications across the pipeline — including a couple of
 * overdue follow-ups — so the board, stats, and alert banner all have something
 * to show on first run.
 */
export function makeSampleApplications() {
  return [
    {
      company: 'Anthropic',
      role: 'Frontend Engineer',
      status: Status.INTERVIEW,
      dateApplied: daysAgo(12),
      salary: '$180k',
      link: 'https://www.anthropic.com/careers',
      nextFollowUp: daysAgo(2), // overdue → banner
      notes: 'Onsite scheduled. Prep system design + React internals.',
    },
    {
      company: 'Linear',
      role: 'Product Engineer',
      status: Status.PHONE_SCREEN,
      dateApplied: daysAgo(5),
      salary: '$165k',
      link: '',
      nextFollowUp: daysAgo(0), // due today → banner
      notes: 'Recruiter: Sam. Loved the keyboard-first ethos.',
    },
    {
      company: 'Vercel',
      role: 'DX Engineer',
      status: Status.APPLIED,
      dateApplied: daysAgo(3),
      salary: '',
      link: 'https://vercel.com/careers',
      nextFollowUp: daysAgo(-4), // future
      notes: 'Referred by a former colleague.',
    },
    {
      company: 'Figma',
      role: 'Design Engineer',
      status: Status.OFFER,
      dateApplied: daysAgo(28),
      salary: '$195k',
      link: '',
      nextFollowUp: '',
      notes: 'Offer in hand — negotiating equity.',
    },
    {
      company: 'Notion',
      role: 'Senior Frontend Engineer',
      status: Status.REJECTED,
      dateApplied: daysAgo(34),
      salary: '',
      link: '',
      nextFollowUp: '',
      notes: 'Rejected after final round. Ask for feedback.',
    },
    {
      company: 'Stripe',
      role: 'UI Engineer',
      status: Status.APPLIED,
      dateApplied: daysAgo(1),
      salary: '$175k',
      link: 'https://stripe.com/jobs',
      nextFollowUp: '',
      notes: '',
    },
  ].map(createApplication);
}
