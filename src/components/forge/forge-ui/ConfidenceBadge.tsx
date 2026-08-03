type ConfidenceBadgeProps = {
  value: number;

  label?: string;

  showPercentage?: boolean;

  className?: string;
};

export function ConfidenceBadge({
  value,
  label = "Confidence",
  showPercentage = true,
  className = "",
}: ConfidenceBadgeProps) {
  const normalized =
    normalizeConfidence(
      value,
    );

  const level =
    confidenceLevel(
      normalized,
    );

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        toneClassName(
          level,
        ),
        className,
      ].join(" ")}
      aria-label={`${label}: ${formatPercentage(
        normalized,
      )}`}
    >
      <span
        aria-hidden="true"
        className="relative size-2 overflow-hidden rounded-full bg-current/20"
      >
        <span className="absolute inset-0 rounded-full bg-current" />
      </span>

      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em]">
        {label}
      </span>

      {showPercentage && (
        <span className="text-xs font-black tabular-nums">
          {formatPercentage(
            normalized,
          )}
        </span>
      )}
    </div>
  );
}

type ConfidenceLevel =
  | "low"
  | "moderate"
  | "high";

function confidenceLevel(
  value: number,
): ConfidenceLevel {
  if (value >= 0.75) {
    return "high";
  }

  if (value >= 0.45) {
    return "moderate";
  }

  return "low";
}

function toneClassName(
  level: ConfidenceLevel,
): string {
  switch (level) {
    case "high":
      return [
        "border-emerald-500/20",
        "bg-emerald-500/[0.06]",
        "text-emerald-700",
        "dark:text-emerald-300",
      ].join(" ");

    case "moderate":
      return [
        "border-amber-500/20",
        "bg-amber-500/[0.06]",
        "text-amber-700",
        "dark:text-amber-300",
      ].join(" ");

    case "low":
    default:
      return [
        "border-border",
        "bg-background",
        "text-muted-foreground",
      ].join(" ");
  }
}

function normalizeConfidence(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    value * 100,
  )}%`;
}