# Job Tracker

A warm, editorial kanban board for tracking job applications through your pipeline — drag cards between stages, log follow-ups, and watch your funnel metrics. Everything persists locally in your browser; there is no backend and no account.

Built with **React + Vite + Tailwind CSS v4**, styled after the Claude.com design language (cream canvas, coral accent, navy surfaces).

## Features

- **Kanban board** — one column per status (Applied → Phone Screen → Interview → Offer → Rejected → Withdrawn). Drag cards between columns (powered by [`@dnd-kit`](https://dndkit.com)) to update status; full keyboard drag support.
- **Application cards** show company, role, date applied, days-since-applied, and an inline follow-up indicator.
- **Add / detail-edit modal** with company, role, status, salary, posting link, editable notes, and an editable next-follow-up date. Accessible: focus-trapped, labelled fields, announced validation.
- **Dashboard stats** — active applications, response rate, interview-conversion rate, and applications this week.
- **Follow-up alert banner** surfacing any application whose follow-up date has passed (or is due today).
- **Search** by company or role, and **CSV export** of all applications (with formula-injection protection).
- **Local persistence** via a `useApplications` hook backed by `localStorage`.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # run oxlint
```

Requires Node.js 20+.

## Project structure

```
src/
  models/application.js     # Status enum, createApplication factory, normalizeApplication, STATUS_META
  hooks/useApplications.js  # localStorage-backed CRUD hook (add/update/remove/clearAll/replaceAll)
  selectors/
    stats.js                # dashboard metrics (pure)
    followUps.js            # due-follow-up selector (pure)
  lib/
    dates.js                # local-timezone ISO date helpers
    csv.js                  # CSV serialization + download (RFC-4180 + formula-injection guard)
    sampleData.js           # demo data
  components/               # Modal, ApplicationFormModal, ApplicationCard, Column,
                            # KanbanBoard, StatCard, DashboardHeader, FollowUpBanner, Toolbar
  index.css                 # Tailwind v4 @theme design tokens, fonts, animations
  App.jsx                   # composition, search filter, modal orchestration
```

The logic layer (`selectors/`, `lib/`) is pure and framework-free, so metrics, dates, and CSV behavior are testable independently of React.

### Data model

```js
{
  id,            // uuid
  company,       // string
  role,          // string
  status,        // "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected" | "Withdrawn"
  dateApplied,   // ISO "YYYY-MM-DD"
  salary,        // free-form string
  link,          // URL to the posting
  notes,         // string
  nextFollowUp,  // ISO "YYYY-MM-DD" or ""
}
```

## Deployment

The app is a static SPA — the production build in `dist/` can be served by any static host.

### Vercel (recommended)

Vercel zero-config-detects Vite. The included [`vercel.json`](./vercel.json) adds security response headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection) and long-lived caching for hashed assets.

```bash
npm i -g vercel
vercel            # preview deploy
vercel --prod     # production deploy
```

### Any static host

```bash
npm run build     # outputs dist/
# serve the contents of dist/ (Netlify, Cloudflare Pages, GitHub Pages, S3, nginx, …)
```

## Security & privacy

- **No backend, no telemetry, no accounts.** All data lives in your browser's `localStorage`; nothing is transmitted.
- **CSV export is hardened** against spreadsheet formula injection (cells beginning with `= + - @` are neutralized).
- **Security headers** (CSP and friends) are configured in `vercel.json` for the production deployment.
- The only third-party network request is Google Fonts (Cormorant Garamond / Inter / JetBrains Mono); the CSP is scoped to allow exactly that.

## License

Private project — not currently licensed for redistribution.
