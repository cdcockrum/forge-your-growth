import type {
  LucideIcon,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type EmptyStateProps = {
  icon?: LucideIcon;

  eyebrow?: string;

  title: string;

  description: string;

  action?: ReactNode;

  secondaryAction?: ReactNode;

  compact?: boolean;

  className?: string;
};

export function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className = "",
}: EmptyStateProps) {
  return (
    <section
      className={[
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border",
        "bg-card text-center",
        compact
          ? "px-5 py-8"
          : "px-6 py-12 sm:px-10 sm:py-16",
        className,
      ].join(" ")}
    >
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
          <Icon
            aria-hidden="true"
            className="size-5 text-accent"
          />
        </div>
      )}

      {eyebrow && (
        <p
          className={[
            "font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
            Icon
              ? "mt-5"
              : "",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={[
          "text-balance font-black tracking-tight",
          eyebrow || Icon
            ? "mt-2"
            : "",
          compact
            ? "text-lg"
            : "text-xl sm:text-2xl",
        ].join(" ")}
      >
        {title}
      </h2>

      <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          {action}

          {secondaryAction}
        </div>
      )}
    </section>
  );
}