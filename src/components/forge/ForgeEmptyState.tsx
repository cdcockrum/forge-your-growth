import type { ReactNode } from "react";

type ForgeEmptyStateProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function ForgeEmptyState({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: ForgeEmptyStateProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}

      <h3 className="mt-3 text-xl font-extrabold tracking-tight">
        {title}
      </h3>

      {description && (
        <div className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      )}

      {action && (
        <div className="mt-6 flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}