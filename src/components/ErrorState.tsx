"use client";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--error)]/30 bg-[var(--surface)] p-12 text-center"
      role="alert"
    >
      <span className="text-4xl" aria-hidden>
        ⚠️
      </span>
      <p className="text-[var(--error)]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
