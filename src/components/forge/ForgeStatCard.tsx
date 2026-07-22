import type { ReactNode } from "react";

type ForgeStatCardProps = {
  label: string;
  value: ReactNode;
  description?: string;
};

export function ForgeStatCard({
  label,
  value,
  description,
}: ForgeStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-3 text-3xl font-black tracking-tight">
        {value}
      </div>

      {description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}