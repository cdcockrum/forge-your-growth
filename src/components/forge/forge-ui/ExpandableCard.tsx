import type {
  LucideIcon,
} from "lucide-react";

import {
  ChevronDown,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type ExpandableCardProps = {
  title: string;

  description?: string;

  eyebrow?: string;

  icon?: LucideIcon;

  children: ReactNode;

  defaultOpen?: boolean;

  className?: string;
};

export function ExpandableCard({
  title,
  description,
  eyebrow,
  icon: Icon,
  children,
  defaultOpen = false,
  className = "",
}: ExpandableCardProps) {
  return (
    <details
      className={[
        "group overflow-hidden rounded-3xl border border-border bg-card",
        "transition-[border-color,background-color,box-shadow] duration-200",
        "hover:border-accent/25 hover:shadow-sm",
        "open:border-accent/20",
        "motion-reduce:transition-none",
        className,
      ].join(" ")}
      open={
        defaultOpen
      }
    >
      <summary
        className={[
          "flex min-h-20 cursor-pointer list-none items-center justify-between gap-4",
          "px-5 py-5 sm:px-6",
          "transition-colors duration-200 hover:bg-accent/[0.025]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          "motion-reduce:transition-none",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
              <Icon
                aria-hidden="true"
                className="size-4 text-accent"
              />
            </div>
          )}

          <div className="min-w-0">
            {eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {eyebrow}
              </p>
            )}

            <p className="mt-1 text-base font-black tracking-tight">
              {title}
            </p>

            {description && (
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            View details
          </span>

          <div className="flex size-9 items-center justify-center rounded-full border border-border bg-background transition-[border-color,background-color,transform] duration-200 group-hover:border-accent/25 group-hover:bg-accent/[0.04] group-open:rotate-180 motion-reduce:transition-none">
            <ChevronDown
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </div>
        </div>
      </summary>

      <div className="border-t border-border bg-background/30 p-5 sm:p-6">
        {children}
      </div>
    </details>
  );
}