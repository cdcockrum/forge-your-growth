import type {
  BriefingMetric,
} from "../types";

type MetricChipProps = {
  metric: BriefingMetric;
};

export function MetricChip({
  metric,
}: MetricChipProps) {
  return (
    <div className="rounded-xl border bg-background px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {metric.label}
      </p>

      <div className="mt-1 flex items-center gap-2">
        <p className="text-xl font-semibold">
          {metric.value}
        </p>

        {metric.trend ? (
          <span className="text-xs capitalize text-muted-foreground">
            {metric.trend}
          </span>
        ) : null}
      </div>
    </div>
  );
}