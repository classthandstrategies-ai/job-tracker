import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Base modal: fixed full-screen scrim + centered panel. Closes on Escape or
 * backdrop click, locks body scroll while open, traps Tab focus inside the
 * dialog, and restores focus to the triggering element on close.
 */
export default function Modal({ title, onClose, children, footer }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    // The element focused before the modal opened (the card/chip/button trigger).
    const previouslyFocused = document.activeElement;

    const focusable = () =>
      panel
        ? [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
        : [];

    // Move focus into the dialog unless an inner control already grabbed it
    // (e.g. the add form's autoFocus on the Company field).
    if (panel && !panel.contains(previouslyFocused)) {
      const items = focusable();
      (items[0] ?? panel).focus();
    }

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      // Trap Tab within the dialog so focus can't reach controls behind the scrim.
      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="animate-pop-in my-auto w-full max-w-lg rounded-xl border border-hairline bg-canvas shadow-[0_20px_60px_-20px_rgba(20,20,19,0.35)] focus:outline-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 className="font-display text-[28px] leading-none text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-card hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-hairline px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
