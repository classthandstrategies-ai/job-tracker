/**
 * Board toolbar: free-text search (matched against company + role), a CSV
 * export action, and the primary "Add application" button.
 */
export default function Toolbar({
  query,
  onQuery,
  onAdd,
  onExport,
  matchCount,
  totalCount,
}) {
  const filtering = query.trim().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search company or role…"
          className="w-full rounded-md border border-hairline bg-canvas py-2.5 pl-9 pr-3 text-[14px] text-ink placeholder:text-muted-soft transition-shadow focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
        />
      </div>

      {filtering ? (
        <span className="text-[13px] text-muted">
          {matchCount} of {totalCount}
        </span>
      ) : null}

      <button
        type="button"
        onClick={onExport}
        disabled={totalCount === 0}
        className="flex items-center gap-2 rounded-md border border-hairline bg-canvas px-4 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:text-muted-soft"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <path d="M7 10l5 5 5-5M12 15V3" />
        </svg>
        Export CSV
      </button>

      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[14px] font-medium text-on-primary transition-colors hover:bg-primary-active"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add application
      </button>
    </div>
  );
}
