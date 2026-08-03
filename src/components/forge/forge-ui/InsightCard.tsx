import type {
  LucideIcon,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type InsightCardProps = {
  eyebrow?: string;

  title: string;

  description?: string;

  icon?: LucideIcon;

  action?: ReactNode;

  footer?: ReactNode;

  tone?:
    | "default"
    | "positive"
    | "warning"
    | "critical"
    | "informational";

  children?: ReactNode;

  className?: string;
};

export function InsightCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  footer,
  tone = "default",
  children,
  className = "",
}: InsightCardProps) {
  return (
    <article
      className={[
        "overflow-hidden rounded-3xl border",
        "bg-card",
        "transition-[border-color,background-color,transform] duration-200",
        "motion-reduce:transition-none",
        toneClassName(
          tone,
        ),
        className,
      ].join(" ")}
    >
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
                <Icon
                  aria-hidden="true"
                  className="size-5 text-accent"
                />
              </div>
            )}

            <div className="min-w-0">
              {eyebrow && (
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {eyebrow}
                </p>
              )}

              <h2 className="mt-1 text-pretty text-xl font-black tracking-tight sm:text-2xl">
                {title}
              </h2>

              {description && (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>

        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>

      {footer && (
        <footer className="border-t border-border bg-background/50 px-6 py-4 sm:px-7">
          {footer}
        </footer>
      )}
    </article>
  );
}

function toneClassName(
  tone:
    NonNullable<
      InsightCardProps["tone"]
    >,
): string {
  switch (tone) {
    case "positive":
      return [
        "border-emerald-500/20",
        "bg-emerald-500/[0.025]",
      ].join(" ");

    case "warning":
      return [
        "border-amber-500/20",
        "bg-amber-500/[0.025]",
      ].join(" ");

    case "critical":
      return [
        "border-destructive/20",
        "bg-destructive/[0.025]",
      ].join(" ");

    case "informational":
      return [
        "border-sky-500/20",
        "bg-sky-500/[0.025]",
      ].join(" ");

    case "default":
    default:
      return "border-border";
  }
}