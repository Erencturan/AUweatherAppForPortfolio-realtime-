"use client";

interface ChartSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ChartSection({ title, children }: ChartSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-lg font-semibold text-[var(--muted)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
