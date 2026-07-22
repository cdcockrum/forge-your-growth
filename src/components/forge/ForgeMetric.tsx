type ForgeMetricProps = {
  label: string;
  value: string | number;
};

export function ForgeMetric({
  label,
  value,
}: ForgeMetricProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}