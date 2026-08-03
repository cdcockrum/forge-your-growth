import type {
  LucideIcon,
} from "lucide-react";

type MetricCardProps = {
  label: string;

  value: string;

  description?: string;

  icon?: LucideIcon;

  emphasis?:
    | "default"
    | "positive"
    | "warning"
    | "critical";

  className?: string;
};

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  emphasis = "default",
  className = "",
}: MetricCardProps) {
  return (
    <article
      className={[
        "min-w-0 rounded-2xl border border-border bg-background p-4",
        "transition-[border-color,background-color,transform] duration-200",
        "motion-reduce:transition-none",
        emphasisClassName(
          emphasis,
        ),
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="size-4 shrink-0 text-accent"
          />
        )}

        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-3 wrap-break-word text-lg font-black tracking-tight">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      )}
    </article>
  );
}

function emphasisClassName(
  emphasis:
    NonNullable<
      MetricCardProps["emphasis"]
    >,
): string {
  switch (emphasis) {
    case "positive":
      return "border-emerald-500/20 bg-emerald-500/[0.04]";

    case "warning":
      return "border-amber-500/20 bg-amber-500/[0.04]";

    case "critical":
      return "border-destructive/20 bg-destructive/[0.04]";

    case "default":
    default:
      return "";
  }
}