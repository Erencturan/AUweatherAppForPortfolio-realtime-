"use client";

interface LoadingStateProps {
  message?: string;
}

const DEFAULT_MESSAGE = "Loading weather…";

export function LoadingState({ message = DEFAULT_MESSAGE }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12">
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
        aria-hidden
      />
      <p className="text-[var(--muted)]">{message}</p>
    </div>
  );
}
