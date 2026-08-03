import type {
  LucideIcon,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type HeroCardProps = {
  eyebrow?: string;

  title: ReactNode;

  description?: ReactNode;

  icon?: LucideIcon;

  action?: ReactNode;

  aside?: ReactNode;

  footer?: ReactNode;

  children?: ReactNode;

  className?: string;
};

export function HeroCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  aside,
  footer,
  children,
  className = "",
}: HeroCardProps) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-[2rem] border border-border",
        "bg-card",
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(circle_at_15%_10%,hsl(var(--accent)/0.08),transparent_38%)]",
        ].join(" ")}
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              {Icon && (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/80 backdrop-blur-sm">
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-accent"
                  />
                </div>
              )}

              <div className="min-w-0">
                {eyebrow && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                    {eyebrow}
                  </p>
                )}

                <h1 className="mt-2 max-w-4xl text-balance text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                  {title}
                </h1>

                {description && (
                  <div className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {description}
                  </div>
                )}
              </div>
            </div>

            {children && (
              <div className="mt-8">
                {children}
              </div>
            )}

            {action && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {action}
              </div>
            )}
          </div>

          {aside && (
            <aside className="min-w-0 lg:w-72">
              {aside}
            </aside>
          )}
        </div>
      </div>

      {footer && (
        <footer className="relative border-t border-border bg-background/50 px-6 py-4 sm:px-8 lg:px-10">
          {footer}
        </footer>
      )}
    </section>
  );
}