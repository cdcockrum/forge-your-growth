type StatusBadgeProps = {
  label: string;

  tone?:
    | "neutral"
    | "positive"
    | "warning"
    | "critical"
    | "informational";

  className?: string;
};

export function StatusBadge({
  label,
  tone = "neutral",
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1",
        "font-mono text-[9px] font-semibold uppercase tracking-[0.18em]",
        toneClassName(
          tone,
        ),
        className,
      ].join(" ")}
    >
      {formatLabel(
        label,
      )}
    </span>
  );
}

function toneClassName(
  tone:
    NonNullable<
      StatusBadgeProps["tone"]
    >,
): string {
  switch (tone) {
    case "positive":
      return "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300";

    case "warning":
      return "border-amber-500/20 bg-amber-500/[0.06] text-amber-700 dark:text-amber-300";

    case "critical":
      return "border-destructive/20 bg-destructive/[0.06] text-destructive";

    case "informational":
      return "border-sky-500/20 bg-sky-500/[0.06] text-sky-700 dark:text-sky-300";

    case "neutral":
    default:
      return "border-border bg-background text-muted-foreground";
  }
}

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll(
      "-",
      " ",
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}