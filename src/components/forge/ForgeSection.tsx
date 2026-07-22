import type { ReactNode } from "react";

type ForgeSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ForgeSection({
  eyebrow,
  title,
  description,
  action,
  children,
}: ForgeSectionProps): React.ReactElement {
  return (
    <section className="space-y-5">
      {(eyebrow || title || description || action) && (
        <header className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            {eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {eyebrow}
              </p>
            )}

            {title && (
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </header>
      )}

      {children}
    </section>
  );
}