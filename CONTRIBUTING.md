# Contributing to Job Tracker

Thanks for your interest in improving Job Tracker! Contributions of all kinds are
welcome — bug reports, feature ideas, docs, and code. This is a small, friendly
project, so don't worry about getting everything perfect.

## Filing issues

Found a bug or have an idea? [Open an issue](https://github.com/classthandstrategies-ai/job-tracker/issues) and include:

- **For bugs:** what you expected, what actually happened, and steps to reproduce. A screenshot and your browser/OS help a lot.
- **For features:** the problem you're trying to solve, not just the solution you have in mind.

Please search existing issues first to avoid duplicates.

## Development setup

```bash
git clone https://github.com/classthandstrategies-ai/job-tracker.git
cd job-tracker
npm install
npm run dev
```

Requires Node.js 20 or newer.

## Making changes

1. **Fork** the repo and create a branch from `main`.
2. **Name your branch** by type and a short description:
   - `feat/column-reordering`
   - `fix/csv-export-encoding`
   - `docs/readme-typo`
   - `chore/bump-deps`
3. **Make your change.** Keep the logic layer (`src/selectors/`, `src/lib/`) pure and framework-free where possible.
4. **Check it before pushing:**
   ```bash
   npm run lint          # oxlint — must pass with 0 errors
   npm run format        # apply Prettier formatting
   npm run build         # must build cleanly
   ```
5. **Commit** with a clear, present-tense message (e.g. `fix: prevent stale form data when re-opening a card`).

## Pull request process

1. Push your branch and [open a PR](https://github.com/classthandstrategies-ai/job-tracker/pulls) against `main`.
2. Describe **what** changed and **why**. Link any related issue (e.g. `Closes #12`).
3. Include before/after screenshots for any UI change.
4. Make sure CI is green — the workflow runs lint, format check, and build on every PR.
5. A maintainer will review. Keep PRs focused; smaller is easier to merge.

## Code style

- Formatting is enforced by **Prettier** (`npm run format`) and linting by **oxlint** (`npm run lint`). CI checks both.
- Match the surrounding code: single quotes, semicolons, 2-space indent.
- Add a comment only where the _why_ isn't obvious from the code.

By contributing, you agree that your contributions will be licensed under the
project's [MIT License](./LICENSE).
