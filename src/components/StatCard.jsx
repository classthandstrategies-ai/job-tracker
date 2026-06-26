/**
 * A single dashboard metric. The value uses the serif display face (numbers in
 * Cormorant is an on-brand Claude.com detail), the label a muted uppercase caption.
 */
export default function StatCard({ label, value, suffix = '', hint, accent = false }) {
  return (
    <div
      className={[
        'rounded-lg border p-5 transition-colors',
        accent
          ? 'border-transparent bg-surface-dark text-on-dark'
          : 'border-hairline bg-canvas',
      ].join(' ')}
    >
      <p
        className={[
          'text-[12px] font-medium uppercase tracking-[1.5px]',
          accent ? 'text-on-dark-soft' : 'text-muted',
        ].join(' ')}
      >
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-[40px] leading-none">{value}</span>
        {suffix ? (
          <span className={accent ? 'text-on-dark-soft' : 'text-muted'}>{suffix}</span>
        ) : null}
      </p>
      {hint ? (
        <p
          className={`mt-1.5 text-[12px] ${accent ? 'text-on-dark-soft' : 'text-muted-soft'}`}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
