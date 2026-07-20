import type { ReactNode } from "react";

type ForgeSectionProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function ForgeSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}: ForgeSectionProps) {
  return (
    <section className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
            {title}
          </h2>

          {description && (
            <div className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </div>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-5">
          {children}
        </div>
      )}
    </section>
  );
}