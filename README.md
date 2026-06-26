# Job Tracker

> A warm, editorial kanban board for tracking your job applications — drag cards through each stage, log follow-ups, and watch your funnel metrics. 100% client-side, no account required.

[![CI](https://github.com/classthandstrategies-ai/job-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/classthandstrategies-ai/job-tracker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live on Vercel](https://img.shields.io/badge/Live%20Demo-jobstack--sepia.vercel.app-000?logo=vercel&logoColor=white)](https://jobstack-sepia.vercel.app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fclassthandstrategies-ai%2Fjob-tracker)

---

## Screenshot

<!-- 📸 Add a screenshot or short demo GIF here. Save the file to docs/screenshot.png and uncomment the line below. -->
<!-- ![Job Tracker board](docs/screenshot.png) -->

> **📸 Add your screenshot here:** drop a still or short GIF at `docs/screenshot.png`, then uncomment the image line above. A wide shot of the board with a few cards plus the dashboard and follow-up banner shows the app off best.

## Live demo

🔗 **[jobstack-sepia.vercel.app →](https://jobstack-sepia.vercel.app)**

Deployed on Vercel with the security headers from [`vercel.json`](./vercel.json) (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

## Features

- **Kanban pipeline** — one column per status (Applied → Phone Screen → Interview → Offer → Rejected → Withdrawn). Drag cards between columns (via [`@dnd-kit`](https://dndkit.com)) to update status, with a dedicated drag handle and full keyboard-drag support.
- **Rich cards** — each shows company, role, date applied, days-since-applied, and an inline "follow-up due" indicator.
- **Add & edit modals** — capture company, role, status, salary, posting link, free-form notes, and a next-follow-up date. Fully accessible: focus-trapped, labelled fields, and screen-reader-announced validation.
- **Dashboard metrics** — active applications, response rate, interview-conversion rate, and applications submitted this week.
- **Follow-up alerts** — a banner surfaces every application whose follow-up date has arrived or passed.
- **Search & filter** — instantly filter the board by company or role.
- **CSV export** — download all applications as a spreadsheet, hardened against formula injection.
- **Local-first persistence** — everything is saved to your browser's `localStorage`; nothing leaves your machine.

## Tech stack

| Layer       | Choice                                                               |
| ----------- | -------------------------------------------------------------------- |
| Framework   | [React 19](https://react.dev)                                        |
| Build tool  | [Vite 8](https://vite.dev)                                           |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`) |
| Drag & drop | [@dnd-kit](https://dndkit.com)                                       |
| Linting     | [oxlint](https://oxc.rs)                                             |
| Formatting  | [Prettier](https://prettier.io)                                      |
| Fonts       | Cormorant Garamond · Inter · JetBrains Mono (Google Fonts)           |

## Prerequisites

- **Node.js 20 or newer** ([nvm](https://github.com/nvm-sh/nvm) recommended)
- **npm** (ships with Node)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/classthandstrategies-ai/job-tracker.git
cd job-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Available scripts

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR            |
| `npm run build`        | Production build to `dist/`                   |
| `npm run preview`      | Preview the production build locally          |
| `npm run lint`         | Lint with oxlint                              |
| `npm run format`       | Format all files with Prettier                |
| `npm run format:check` | Check formatting without writing (used in CI) |

## Environment variables

**None required.** Job Tracker is fully client-side and stores all data in `localStorage`, so it runs, builds, and deploys with zero configuration.

A [`.env.example`](./.env.example) is included as a template for forks that add a backend or third-party services. To use it, copy it to `.env` (which is gitignored) and add your values. Only variables prefixed with `VITE_` are exposed to client code.

## Usage

1. **Add an application** — click **Add application** (or load the bundled sample data on first run) and fill in the company and role. Everything else is optional.
2. **Move it through your pipeline** — drag a card by its grip handle into the next column, or change its status from the edit modal. Keyboard users can grab a card's handle with <kbd>Space</kbd> and move it with the arrow keys.
3. **Open a card** — click it (or focus it and press <kbd>Enter</kbd>) to view and edit details, add notes, or set a next-follow-up date.
4. **Stay on top of follow-ups** — when a follow-up date arrives, the application appears in the alert banner at the top.
5. **Find anything** — use the search box to filter by company or role.
6. **Back up or analyze** — click **Export CSV** to download your full list as a spreadsheet.

Your data lives only in this browser. Clearing site data (or using a different browser/device) starts you fresh — use CSV export to keep a backup.

## Project structure

```
job-tracker/
├─ .github/workflows/ci.yml   # CI: lint, format check, build
├─ public/                    # static assets (favicon)
├─ src/
│  ├─ components/             # UI: Modal, ApplicationFormModal, ApplicationCard,
│  │                          #     Column, KanbanBoard, StatCard, DashboardHeader,
│  │                          #     FollowUpBanner, Toolbar
│  ├─ hooks/
│  │  └─ useApplications.js   # localStorage-backed CRUD hook
│  ├─ lib/
│  │  ├─ dates.js             # local-timezone ISO date helpers
│  │  ├─ csv.js               # CSV export (RFC-4180 + formula-injection guard)
│  │  └─ sampleData.js        # demo data
│  ├─ models/
│  │  └─ application.js        # Status enum, createApplication, normalizeApplication
│  ├─ selectors/
│  │  ├─ stats.js             # dashboard metrics (pure)
│  │  └─ followUps.js         # due-follow-up selector (pure)
│  ├─ App.jsx                 # composition, search, modal orchestration
│  ├─ index.css               # Tailwind v4 @theme tokens, fonts, animations
│  └─ main.jsx                # React entry point
├─ vercel.json                # deploy config + security headers
└─ vite.config.js
```

The `selectors/` and `lib/` layers are pure and framework-free, so the metrics, date, and CSV logic can be reasoned about and tested independently of React.

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

This project is **optimized for [Vercel](https://vercel.com)** and deploys with zero configuration — Vercel auto-detects Vite, so the build command (`npm run build`) and output directory (`dist`) are picked up automatically. The included [`vercel.json`](./vercel.json) adds security response headers (Content-Security-Policy, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and long-lived caching for hashed assets.

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fclassthandstrategies-ai%2Fjob-tracker)

### Or via the CLI

```bash
npm i -g vercel
vercel            # create a preview deployment
vercel --prod     # promote to production
```

### Any other static host

The build output is plain static files, so any static host works (Netlify, Cloudflare Pages, GitHub Pages, S3, nginx, …):

```bash
npm run build     # outputs to dist/
# then serve the contents of dist/
```

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Node version     | 20+             |

## Contributing

Contributions are welcome! Bug reports, feature ideas, and PRs all help. Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for how to file issues, branch naming, and the PR process. New contributors are especially welcome.

## License

Released under the [MIT License](./LICENSE). © 2026 Geetesh.

## Credits & acknowledgments

- **Design language** inspired by the [Claude.com](https://claude.com) / Anthropic aesthetic — warm cream canvas, coral accent, and navy product surfaces.
- **Fonts** served by [Google Fonts](https://fonts.google.com): Cormorant Garamond, Inter, and JetBrains Mono.
- Built with [React](https://react.dev), [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com), and [@dnd-kit](https://dndkit.com).
- No external data sources, APIs, or datasets are used — all data is user-entered and stored locally.
